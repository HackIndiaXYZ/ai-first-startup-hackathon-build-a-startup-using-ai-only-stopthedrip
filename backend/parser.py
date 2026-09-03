"""
Bank statement transaction parser for StopTheDrip.
Extracts transactions from PDF (via pdfplumber) and CSV (via python csv module) in-memory.
Normalizes extracted data into: [{"date": "YYYY-MM-DD", "description": "...", "amount": float}]
"""

import csv
import io
import re
from datetime import datetime
from typing import Any, Dict, List, Optional
import pdfplumber


DATE_PATTERNS = [
    (r"\b(\d{4}[-/.]\d{1,2}[-/.]\d{1,2})\b", ["%Y-%m-%d", "%Y/%m/%d", "%Y.%m.%d"]),
    (r"\b(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})\b", ["%d-%m-%Y", "%d/%m/%Y", "%m/%d/%Y", "%m-%d-%Y"]),
    (r"\b(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})\b", ["%d %b %Y", "%d %B %Y"]),
    (r"\b([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})\b", ["%b %d, %Y", "%b %d %Y", "%B %d, %Y", "%B %d %Y"]),
]


def clean_amount(val: Any) -> Optional[float]:
    """Parse string representation of monetary amount into float."""
    if val is None:
        return None
    s = str(val).strip()
    if not s:
        return None
    
    # Remove currency symbols and non-numeric except minus, dot, comma
    s = re.sub(r"[₹$€£¥\s]", "", s)
    # Handle parenthesized negative: (123.45) -> -123.45
    if s.startswith("(") and s.endswith(")"):
        s = "-" + s[1:-1]
    
    # Handle comma/dot decimal formats
    if "," in s and "." in s:
        if s.rfind(",") > s.rfind("."):
            # European format: 1.234,56
            s = s.replace(".", "").replace(",", ".")
        else:
            # US/UK format: 1,234.56
            s = s.replace(",", "")
    elif "," in s:
        # Check if comma is decimal or thousands
        parts = s.split(",")
        if len(parts) == 2 and len(parts[1]) == 2:
            s = s.replace(",", ".")
        else:
            s = s.replace(",", "")

    # Extract clean number
    match = re.search(r"[-+]?\d+(?:\.\d+)?", s)
    if match:
        try:
            return abs(float(match.group(0)))
        except ValueError:
            return None
    return None


def normalize_date(date_str: str) -> str:
    """Normalize arbitrary date string into YYYY-MM-DD."""
    if not date_str:
        return datetime.now().strftime("%Y-%m-%d")
    s = date_str.strip()
    
    for pattern, fmts in DATE_PATTERNS:
        m = re.search(pattern, s)
        if m:
            extracted = m.group(1).replace("/", "-").replace(".", "-")
            for fmt in fmts:
                try:
                    dt = datetime.strptime(extracted, fmt.replace("/", "-").replace(".", "-"))
                    return dt.strftime("%Y-%m-%d")
                except ValueError:
                    pass
    
    # Fallback to current year date if month-day found
    m2 = re.search(r"\b(\d{1,2})[-/.](\d{1,2})\b", s)
    if m2:
        try:
            now_year = datetime.now().year
            return f"{now_year}-{int(m2.group(2)):02d}-{int(m2.group(1)):02d}"
        except Exception:
            pass
            
    return s[:10]


def parse_csv_content(content_bytes: bytes) -> List[Dict[str, Any]]:
    """
    Parse CSV bank statement into normalized transactions.
    Zero disk storage: reads from BytesIO.
    """
    text = ""
    for encoding in ("utf-8-sig", "utf-8", "latin-1", "cp1252"):
        try:
            text = content_bytes.decode(encoding)
            break
        except UnicodeDecodeError:
            continue
    
    if not text:
        raise ValueError("Unable to decode CSV bank statement content.")

    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if not lines:
        return []

    # Detect delimiter
    sample = "\n".join(lines[:10])
    try:
        dialect = csv.Sniffer().sniff(sample, delimiters=",;\t|")
        delimiter = dialect.delimiter
    except Exception:
        delimiter = ","

    reader = csv.reader(io.StringIO(text), delimiter=delimiter)
    all_rows = [row for row in reader if row and any(col.strip() for col in row)]
    if not all_rows:
        return []

    # Find header row
    header_idx = -1
    date_col = -1
    desc_col = -1
    amount_col = -1
    debit_col = -1

    for idx, row in enumerate(all_rows[:10]):
        row_lower = [c.strip().lower() for c in row]
        for c_idx, col in enumerate(row_lower):
            if any(k in col for k in ["date", "txn date", "value date", "trans date", "time"]):
                date_col = c_idx
            elif any(k in col for k in ["desc", "particular", "narrat", "detail", "merchant", "payee", "memo"]):
                desc_col = c_idx
            elif any(k in col for k in ["debit", "withdrawal", "dr", "spend"]):
                debit_col = c_idx
            elif any(k in col for k in ["amount", "txn amt", "value", "net"]):
                amount_col = c_idx

        if date_col != -1 and (desc_col != -1 or amount_col != -1 or debit_col != -1):
            header_idx = idx
            break

    transactions: List[Dict[str, Any]] = []

    # If no explicit header matched, use column heuristics
    start_idx = header_idx + 1 if header_idx != -1 else 0

    for row in all_rows[start_idx:]:
        if len(row) < 2:
            continue

        date_val = ""
        desc_val = ""
        amt_val = None

        if header_idx != -1:
            if date_col != -1 and date_col < len(row):
                date_val = row[date_col].strip()
            if desc_col != -1 and desc_col < len(row):
                desc_val = row[desc_col].strip()
            
            # Prefer debit column if present
            if debit_col != -1 and debit_col < len(row) and row[debit_col].strip():
                amt_val = clean_amount(row[debit_col])
            elif amount_col != -1 and amount_col < len(row) and row[amount_col].strip():
                amt_val = clean_amount(row[amount_col])
        else:
            # Fallback heuristic: find date-like col, text col, number col
            for col in row:
                col_str = col.strip()
                if not date_val and any(re.search(p[0], col_str) for p in DATE_PATTERNS):
                    date_val = col_str
                elif amt_val is None and clean_amount(col_str) is not None:
                    amt_val = clean_amount(col_str)
                elif not desc_val and len(col_str) > 2 and not col_str.replace(".", "").isdigit():
                    desc_val = col_str

        if amt_val is not None and amt_val > 0:
            if not desc_val:
                desc_val = "Card Transaction"
            transactions.append({
                "date": normalize_date(date_val),
                "description": desc_val,
                "amount": round(amt_val, 2)
            })

    return transactions


def parse_pdf_content(content_bytes: bytes) -> List[Dict[str, Any]]:
    """
    Parse PDF bank statement into normalized transactions.
    Zero disk storage: parses directly from in-memory BytesIO.
    """
    transactions: List[Dict[str, Any]] = []

    with pdfplumber.open(io.BytesIO(content_bytes)) as pdf:
        for page in pdf.pages:
            # 1. Try extracting tables first
            tables = page.extract_tables()
            table_found_txns = False

            for table in tables:
                if not table or len(table) < 2:
                    continue
                
                # Check headers
                date_col = -1
                desc_col = -1
                amt_col = -1
                debit_col = -1

                for c_idx, cell in enumerate(table[0]):
                    if not cell:
                        continue
                    cl = str(cell).lower()
                    if any(k in cl for k in ["date", "txn"]):
                        date_col = c_idx
                    elif any(k in cl for k in ["desc", "particular", "narrat", "detail", "merchant"]):
                        desc_col = c_idx
                    elif any(k in cl for k in ["debit", "withdrawal"]):
                        debit_col = c_idx
                    elif any(k in cl for k in ["amount", "amt", "total"]):
                        amt_col = c_idx

                for row in table[1:]:
                    if not row or len(row) < 2:
                        continue
                    
                    row_strs = [str(c or "").strip() for c in row]
                    d_val = ""
                    desc_val = ""
                    amt_val = None

                    if date_col != -1 and date_col < len(row_strs):
                        d_val = row_strs[date_col]
                    if desc_col != -1 and desc_col < len(row_strs):
                        desc_val = row_strs[desc_col]

                    if debit_col != -1 and debit_col < len(row_strs) and row_strs[debit_col]:
                        amt_val = clean_amount(row_strs[debit_col])
                    elif amt_col != -1 and amt_col < len(row_strs) and row_strs[amt_col]:
                        amt_val = clean_amount(row_strs[amt_col])

                    # Heuristic fallback if columns not identified
                    if amt_val is None:
                        for cell in row_strs:
                            c_amt = clean_amount(cell)
                            if c_amt is not None and c_amt > 0:
                                amt_val = c_amt
                                break

                    if amt_val is not None and amt_val > 0:
                        if not d_val:
                            for cell in row_strs:
                                if any(re.search(p[0], cell) for p in DATE_PATTERNS):
                                    d_val = cell
                                    break
                        if not desc_val:
                            for cell in row_strs:
                                if len(cell) > 3 and clean_amount(cell) is None:
                                    desc_val = cell
                                    break

                        transactions.append({
                            "date": normalize_date(d_val),
                            "description": desc_val or "Card Transaction",
                            "amount": round(amt_val, 2)
                        })
                        table_found_txns = True

            # 2. If table extraction yielded nothing on this page, parse raw lines
            if not table_found_txns:
                text = page.extract_text() or ""
                for line in text.splitlines():
                    line = line.strip()
                    if not line:
                        continue
                    
                    # Look for date and amount in line
                    amt_match = re.findall(r"(?:₹|\$|€|£)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})|\d+(?:\.\d{2}))", line)
                    date_match = None
                    for pattern, _ in DATE_PATTERNS:
                        m = re.search(pattern, line)
                        if m:
                            date_match = m.group(1)
                            break

                    if amt_match and date_match:
                        # Extract amount (usually the debit amount)
                        amt = clean_amount(amt_match[0])
                        if amt and amt > 0:
                            # Description is text between date and amount or remainder
                            desc = line.replace(date_match, "").replace(amt_match[0], "").strip()
                            desc = re.sub(r"^[^\w]+|[^\w]+$", "", desc)
                            transactions.append({
                                "date": normalize_date(date_match),
                                "description": desc or "Card Payment",
                                "amount": round(amt, 2)
                            })

    return transactions


def parse_statement(filename: str, content_bytes: bytes) -> List[Dict[str, Any]]:
    """
    Dispatcher to parse PDF or CSV bank statement based on filename/content.
    """
    fname = filename.lower()
    if fname.endswith(".pdf") or content_bytes.startswith(b"%PDF"):
        return parse_pdf_content(content_bytes)
    elif fname.endswith(".csv") or fname.endswith(".txt"):
        return parse_csv_content(content_bytes)
    else:
        # Try PDF first then CSV
        if content_bytes.startswith(b"%PDF"):
            return parse_pdf_content(content_bytes)
        return parse_csv_content(content_bytes)
