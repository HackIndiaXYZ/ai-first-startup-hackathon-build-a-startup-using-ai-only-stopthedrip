"""
Crypto module for StopTheDrip
Provides real, free 256-bit AES-GCM encryption and decryption.
Ensures zero-disk storage by processing everything strictly in memory (RAM).
"""

import base64
import os
from typing import Tuple
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


def generate_key() -> bytes:
    """Generate a random 256-bit (32-byte) AES key."""
    return AESGCM.generate_key(bit_length=256)


def encrypt_data(data: bytes, key: bytes = None) -> Tuple[bytes, bytes, bytes]:
    """
    Encrypts data using AES-256-GCM.
    Returns: (ciphertext, nonce/iv, key)
    """
    if key is None:
        key = generate_key()
    
    # Standard 12-byte (96-bit) nonce for AES-GCM
    nonce = os.urandom(12)
    aesgcm = AESGCM(key)
    ciphertext = aesgcm.encrypt(nonce, data, associated_data=None)
    
    return ciphertext, nonce, key


def decrypt_data(ciphertext: bytes, nonce: bytes, key: bytes) -> bytes:
    """
    Decrypts AES-256-GCM encrypted data strictly in memory.
    Raises InvalidTag if tampered or incorrect key.
    """
    aesgcm = AESGCM(key)
    return aesgcm.decrypt(nonce, ciphertext, associated_data=None)


def decrypt_payload_b64(payload_b64: str, nonce_b64: str, key_b64: str) -> bytes:
    """
    Helper to decrypt base64-encoded strings from browser Web Crypto API.
    """
    ciphertext = base64.b64decode(payload_b64)
    nonce = base64.b64decode(nonce_b64)
    key = base64.b64decode(key_b64)
    return decrypt_data(ciphertext, nonce, key)
