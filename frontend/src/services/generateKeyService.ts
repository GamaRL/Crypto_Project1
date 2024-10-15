async function generateSymmetricKeyFromPassword(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"],
  );
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256, // 256-bit key
    },
    true, // Extractable
    ["encrypt", "decrypt"]
  );
}

async function encryptPrivateKey(privateKey: CryptoKey, symmetricKey: CryptoKey): Promise<ArrayBuffer> {
  const privateKeyBuffer = await window.crypto.subtle.exportKey("pkcs8", privateKey);

  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
  const encryptedPrivateKey = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    symmetricKey,
    privateKeyBuffer
  );

  // Combine IV and encrypted key
  const combinedBuffer = new Uint8Array(iv.length + encryptedPrivateKey.byteLength);
  combinedBuffer.set(iv);
  combinedBuffer.set(new Uint8Array(encryptedPrivateKey), iv.length);

  return combinedBuffer.buffer; // Return the combined buffer
}

async function decryptPrivateKey(encryptedData: ArrayBuffer, symmetricKey: CryptoKey): Promise<CryptoKey> {
  const combinedArray = new Uint8Array(encryptedData);
  const iv = combinedArray.slice(0, 12); // Extract IV
  const encryptedPrivateKey = combinedArray.slice(12); // Extract encrypted key

  const privateKeyBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    symmetricKey,
    encryptedPrivateKey
  );

  // Import the decrypted private key back to CryptoKey
  return await window.crypto.subtle.importKey(
    "pkcs8",
    privateKeyBuffer,
    {
      name: "RSA-OAEP",
    },
    true,
    ["decrypt"]
  );
}

async function generateKeyPair(): Promise<CryptoKeyPair> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true, // Whether the key is extractable
    ["encrypt", "decrypt"] // Key usages
  );
  return keyPair;
}

async function exportPublicKey(key: CryptoKey): Promise<ArrayBuffer> {
  return await window.crypto.subtle.exportKey("spki", key);
}

async function exportPrivateKey(key: CryptoKey): Promise<ArrayBuffer> {
  return await window.crypto.subtle.exportKey("pkcs8", key);
}

function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function toPEM(buffer: ArrayBuffer, type: string): string {
  const base64 = bufferToBase64(buffer);
  return `-----BEGIN ${type}-----\n` +
    base64.match(/.{1,64}/g)?.join('\n') +
    `\n-----END ${type}-----`;
}

interface KeyPairResponse {
  publicKeyPEM: string,
  privateKeyPEM: string
}

export default async function exportKeys(password: string): Promise<KeyPairResponse> {

  const keyPair = await generateKeyPair();
  const symmetricKey = await generateSymmetricKeyFromPassword(password);

  // Export the public key
  const publicKeyBuffer = await exportPublicKey(keyPair.publicKey);
  const publicKeyPEM = toPEM(publicKeyBuffer, 'PUBLIC KEY');

  const encryptedPrivateKey = await encryptPrivateKey(keyPair.privateKey, symmetricKey);
  const privateKeyPEM = toPEM(encryptedPrivateKey, 'PRIVATE KEY');

  return {
    publicKeyPEM,
    privateKeyPEM
  }
}

