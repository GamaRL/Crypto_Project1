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

export async function generateKeyPair(): Promise<CryptoKeyPair> {
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
