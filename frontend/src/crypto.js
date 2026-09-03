/**
 * Web Crypto API 256-bit AES-GCM local encryption.
 * Encrypts bank statement bytes directly inside the browser before transmission.
 */

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export async function encryptStatementBuffer(fileBuffer) {
  try {
    // Generate an ephemeral 256-bit AES-GCM key
    const key = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    // 12-byte (96-bit) initialization vector / nonce
    const nonce = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt payload in-browser
    const ciphertext = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: nonce },
      key,
      fileBuffer
    );

    // Export raw key bytes to transmit to in-memory decryption endpoint
    const rawKey = await window.crypto.subtle.exportKey('raw', key);

    return {
      success: true,
      encryptedPayloadB64: arrayBufferToBase64(ciphertext),
      nonceB64: arrayBufferToBase64(nonce.buffer),
      keyB64: arrayBufferToBase64(rawKey),
    };
  } catch (err) {
    console.warn('Local Web Crypto encryption error, falling back to TLS transport:', err);
    return {
      success: false,
      error: err.message,
    };
  }
}
