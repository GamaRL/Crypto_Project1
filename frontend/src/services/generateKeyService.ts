export async function generateSymmetricKeyFromPassword(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();

  // Define a fixed salt (must be consistent)
  const fixedSalt = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // Example salt
  const iterations = 100000; // Number of iterations
  const hashAlgorithm = "SHA-256"; // Hash algorithm to use

  // Import the password as a raw key
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  // Derive the key using PBKDF2 with the fixed salt
  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: fixedSalt, // Use the same fixed salt
      iterations: iterations,
      hash: hashAlgorithm
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256 // 256-bit key
    },
    false, // Not extractable
    ["encrypt", "decrypt"] // Usages
  );

  return derivedKey;
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
      hash: "SHA-256",
    },
    false,
    ["decrypt"]
  );
}

export async function importPublicKey(keyBuffer: ArrayBuffer): Promise<CryptoKey> {
  return window.crypto.subtle.importKey(
    'spki',  // For public keys
    keyBuffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,   // Extractable (whether the key can be exported)
    ['encrypt'] // Key usages
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

export async function exportPublicKey(key: CryptoKey): Promise<ArrayBuffer> {
  return await window.crypto.subtle.exportKey("spki", key);
}

async function exportPrivateKey(key: CryptoKey): Promise<ArrayBuffer> {
  return await window.crypto.subtle.exportKey("pkcs8", key);
}

function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export function toPEM(buffer: ArrayBuffer, type: string): string {

  const base64 = bufferToBase64(buffer);
  return `-----BEGIN ${type}-----\n` +
    base64.match(/.{1,64}/g)?.join('\n') +
    `\n-----END ${type}-----`;
}

export function fromPEM(pem: string): ArrayBuffer {
  // Remove the PEM header and footer
  const pemContent = pem.replace(/-----BEGIN.*-----|-----END.*-----|\s+/g, '');

  // Decode the base64 content into binary
  const binary = atob(pemContent);

  // Convert the binary string into an ArrayBuffer
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    view[i] = binary.charCodeAt(i);
  }

  return buffer;
}

async function encryptData(publicKey: CryptoKey, data: string) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP", // Same algorithm used for key generation
    },
    publicKey, // Public key for encryption
    encodedData // Data to encrypt
  );

  return encryptedData; // Return as Uint8Array
}

async function decryptData(privateKey: CryptoKey, encryptedData: ArrayBuffer) {
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP", // Same algorithm used for key generation
    },
    privateKey, // Private key for decryption
    encryptedData // Data to decrypt
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedData); // Convert ArrayBuffer to string
}

interface KeyPairResponse {
  publicKeyPEM: string,
  privateKeyPEM: string
}

export async function importKeys(privateKeyPEM: string, publicKeyPEM: string, key: CryptoKey): Promise<CryptoKeyPair> {

  // Verifying data
  const pubKeyFromPEM = await importPublicKey(fromPEM(publicKeyPEM));

  const encryptedPrivKeyFromPEM = fromPEM(privateKeyPEM);
  const privKeyFromPEM = await decryptPrivateKey(encryptedPrivKeyFromPEM, key);

  if (await decryptData(privKeyFromPEM, await encryptData(pubKeyFromPEM, "__")) === "__") {
    return {
      privateKey: privKeyFromPEM,
      publicKey: pubKeyFromPEM
    }
  }

  throw new Error("Keys are incorrect!");
}

export default async function exportKeys(password: string): Promise<KeyPairResponse> {

  const keyPair = await generateKeyPair();
  const symmetricKey = await generateSymmetricKeyFromPassword(password);

  // Export the public key
  const publicKeyBuffer = await exportPublicKey(keyPair.publicKey);
  const publicKeyPEM = toPEM(publicKeyBuffer, 'PUBLIC KEY');

  const encryptedPrivateKey = await encryptPrivateKey(keyPair.privateKey, symmetricKey);
  const privateKeyPEM = toPEM(encryptedPrivateKey, 'PRIVATE KEY');

  importKeys(privateKeyPEM, publicKeyPEM, symmetricKey);


  return {
    publicKeyPEM,
    privateKeyPEM
  }
}

