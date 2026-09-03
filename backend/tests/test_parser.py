import pytest
from parser import parse_csv_content, clean_amount, normalize_date


def test_clean_amount():
    assert clean_amount("₹999.00") == 999.0
    assert clean_amount("$1,234.56") == 1234.56
    assert clean_amount("1.234,56") == 1234.56
    assert clean_amount("-499.50") == 499.5
    assert clean_amount("(649.00)") == 649.0
    assert clean_amount("invalid") is None


def test_normalize_date():
    assert normalize_date("2026-02-15") == "2026-02-15"
    assert normalize_date("15/02/2026") == "2026-02-15"
    assert normalize_date("02-15-2026") == "2026-02-15"


def test_parse_csv_content():
    csv_bytes = b"""Date,Description,Amount
2026-01-05,Netflix UHD,649.00
2026-01-10,Cult.fit Pass,999.00
2026-02-05,Netflix UHD,649.00
2026-02-10,Cult.fit Pass,999.00
"""
    txns = parse_csv_content(csv_bytes)
    assert len(txns) == 4
    assert txns[0]["description"] == "Netflix UHD"
    assert txns[0]["amount"] == 649.0
    assert txns[0]["date"] == "2026-01-05"
