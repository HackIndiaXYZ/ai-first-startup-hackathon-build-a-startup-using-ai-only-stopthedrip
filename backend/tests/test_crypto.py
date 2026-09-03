import base64
import pytest
from crypto import generate_key, encrypt_data, decrypt_data, decrypt_payload_b64


def test_encryption_decryption_roundtrip():
    data = b"date,description,amount\n2026-01-01,Netflix,649.00\n"
    ciphertext, nonce, key = encrypt_data(data)
    
    assert len(key) == 32  # 256-bit key
    assert len(nonce) == 12 # 96-bit standard GCM nonce
    assert ciphertext != data
    
    decrypted = decrypt_data(ciphertext, nonce, key)
    assert decrypted == data


def test_base64_decryption_helper():
    original = b"Test 256-bit AES-GCM in browser"
    ciphertext, nonce, key = encrypt_data(original)
    
    c_b64 = base64.b64encode(ciphertext).decode("utf-8")
    n_b64 = base64.b64encode(nonce).decode("utf-8")
    k_b64 = base64.b64encode(key).decode("utf-8")
    
    decrypted = decrypt_payload_b64(c_b64, n_b64, k_b64)
    assert decrypted == original


def test_tampered_ciphertext_fails():
    data = b"Secret Financial Data"
    ciphertext, nonce, key = encrypt_data(data)
    
    # Tamper with the last byte of the ciphertext tag
    tampered = ciphertext[:-1] + (b"\x00" if ciphertext[-1:] != b"\x00" else b"\x01")
    
    with pytest.raises(Exception):
        decrypt_data(tampered, nonce, key)
