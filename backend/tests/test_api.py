import os
import pytest
from fastapi.testclient import TestClient
from main import app
from crypto import encrypt_data
import base64

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "active"
    assert "256-bit AES-GCM" in data["encryption"]


def test_sample_download():
    response = client.get("/sample")
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert len(response.text.splitlines()) > 50


def test_analyze_sample_direct():
    response = client.post("/analyze/sample")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["total_leaks_detected"] > 0
    assert data["total_annual_leak"] > 0
    assert len(data["leak_vectors"]) > 0
    assert "encryption" in data


def test_analyze_encrypted_payload():
    raw_csv = b"""Date,Description,Amount
2026-01-01,Cult.fit Pass,999.00
2026-02-01,Cult.fit Pass,999.00
2026-03-01,Cult.fit Pass,999.00
"""
    ciphertext, nonce, key = encrypt_data(raw_csv)
    c_b64 = base64.b64encode(ciphertext).decode("utf-8")
    n_b64 = base64.b64encode(nonce).decode("utf-8")
    k_b64 = base64.b64encode(key).decode("utf-8")

    response = client.post(
        "/analyze",
        data={
            "is_encrypted": "true",
            "encrypted_payload_b64": c_b64,
            "nonce_b64": n_b64,
            "key_b64": k_b64
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert any("Cult.fit" in item["friendly_name"] or "Cult.fit" in item["merchant"] for item in data["leak_vectors"])
