"""
StopTheDrip FastAPI Backend Server.
Provides POST /analyze with PDF/CSV parsing, dual-agent AI leak detection,
real free 256-bit AES-GCM in-memory encryption, and zero data storage.
"""

import asyncio
import io
import json
import os
import time
from typing import Optional
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
import sys
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from crypto import decrypt_data, decrypt_payload_b64
from parser import parse_statement
from analyzer import analyze_transactions, create_empty_response

from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="StopTheDrip Financial Clarity API",
    description="Autonomous recurring subscription pattern detection and financial leak audit engine.",
    version="1.0.0"
)

# Enable CORS for local and production origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
@app.get("/health")
async def health_check():
    """Health check endpoint for deployment monitoring."""
    has_gemini = bool(os.environ.get("GEMINI_API_KEY"))
    has_anthropic = bool(os.environ.get("ANTHROPIC_API_KEY"))
    return {
        "status": "active",
        "service": "StopTheDrip Financial Clarity API",
        "encryption": "256-bit AES-GCM active",
        "storage": "zero-disk-in-memory-only",
        "ai_provider": "google-gemini" if has_gemini else ("anthropic" if has_anthropic else "heuristic-fallback")
    }


@app.post("/analyze")
async def analyze_statement_endpoint(
    file: Optional[UploadFile] = File(None),
    is_encrypted: Optional[bool] = Form(False),
    nonce_b64: Optional[str] = Form(None),
    key_b64: Optional[str] = Form(None),
    encrypted_payload_b64: Optional[str] = Form(None),
    use_sample: Optional[bool] = Form(False)
):
    """
    Primary analysis endpoint:
    - Ingests multipart file (PDF or CSV) or AES-256-GCM encrypted payload.
    - Operates purely in-memory (RAM) with zero disk persistence.
    - Enforces a minimum ~1.5s delay so the analyzing animation plays smoothly.
    - Runs dual-agent classification and cancellation guide generation.
    """
    start_time = time.time()

    try:
        content_bytes: bytes = b""
        filename = "statement.csv"

        # Case 1: Bundled sample requested
        if use_sample:
            sample_path = os.path.join(os.path.dirname(__file__), "sample_statement.csv")
            if os.path.exists(sample_path):
                with open(sample_path, "rb") as f:
                    content_bytes = f.read()
                filename = "sample_statement.csv"
            else:
                raise HTTPException(status_code=404, detail="Sample statement not found on server.")

        # Case 2: Encrypted payload via Web Crypto API
        elif is_encrypted and encrypted_payload_b64 and nonce_b64 and key_b64:
            try:
                content_bytes = decrypt_payload_b64(encrypted_payload_b64, nonce_b64, key_b64)
                filename = file.filename if file else "statement.csv"
            except Exception as dec_err:
                raise HTTPException(status_code=400, detail=f"256-bit AES-GCM Decryption failed: {str(dec_err)}")

        # Case 3: Standard multipart file upload
        elif file is not None:
            filename = file.filename or "statement.csv"
            content_bytes = await file.read()
        else:
            raise HTTPException(status_code=400, detail="No statement file or payload provided.")

        if not content_bytes:
            raise HTTPException(status_code=400, detail="Uploaded statement file is empty.")

        # Parse transactions in-memory
        try:
            transactions = parse_statement(filename, content_bytes)
        except Exception as parse_err:
            raise HTTPException(status_code=422, detail=f"Unable to parse statement: {str(parse_err)}")

        # Best-effort handling: if no transactions parsed, return graceful empty result
        if not transactions:
            results = create_empty_response()
            results["message"] = "No transactions found in the uploaded statement. Please check the file format."
        else:
            # Run AI pipeline
            results = await analyze_transactions(transactions)

        # Enforce minimum ~1.5s duration for the scanning animation
        elapsed = time.time() - start_time
        if elapsed < 1.6:
            await asyncio.sleep(1.6 - elapsed)

        return JSONResponse(content=results)

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Analysis pipeline error: {str(exc)}")


@app.get("/sample")
async def get_sample_statement():
    """Provides the bundled 142-transaction sample bank statement."""
    sample_path = os.path.join(os.path.dirname(__file__), "sample_statement.csv")
    if not os.path.exists(sample_path):
        raise HTTPException(status_code=404, detail="Sample file not found.")
    
    with open(sample_path, "rb") as f:
        data = f.read()
        
    return StreamingResponse(
        io.BytesIO(data),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=sample_statement_142.csv"}
    )


@app.post("/analyze/sample")
async def analyze_sample_direct():
    """Direct analysis endpoint for the 142-transaction sample statement."""
    return await analyze_statement_endpoint(use_sample=True)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
