import { decryptSecret, encryptSecret } from "./encryptionService";
import { generateKeyPair, generateSymmetricKeyFromPassword } from "./keyGenerationService";
import { fromPEM, toPEM } from "./utilities";

interface KeyPairResponse {
  publicKeyPEM: string,
  privateKeyPEM: string
}

export interface SignAndEncryptKeyCollection {
  encryptPublicKey: CryptoKey,
  decryptsPrivateKey: CryptoKey,
  signPrivateKey: CryptoKey,
  verifyPublicKey: CryptoKey,
}

export async function exportPublicKey(key: CryptoKey): Promise<ArrayBuffer> {
  return await window.crypto.subtle.exportKey("spki", key);
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

async function decryptPrivateKey(encryptedData: ArrayBuffer, symmetricKey: CryptoKey): Promise<Pick<SignAndEncryptKeyCollection, "decryptsPrivateKey" | "signPrivateKey">> {
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

  const keyPair = {
    decryptsPrivateKey: await window.crypto.subtle.importKey(
      "pkcs8",
      privateKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      false,
      ["decrypt"]
    ),
    signPrivateKey: await window.crypto.subtle.importKey(
      "pkcs8",
      privateKeyBuffer,
      {
        name: "RSA-PSS",
        hash: "SHA-256",
      },
      false,
      ["sign"]
    )

  }

  return keyPair;
}

export async function importPublicKey(keyBuffer: ArrayBuffer): Promise<Pick<SignAndEncryptKeyCollection, "encryptPublicKey" | "verifyPublicKey">> {

  const keyPair = {
    encryptPublicKey: await window.crypto.subtle.importKey(
      'spki',  // For public keys
      keyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,   // Extractable (whether the key can be exported)
      ["encrypt"] // Key usages
    ),
    verifyPublicKey: await window.crypto.subtle.importKey(
      'spki',  // For public keys
      keyBuffer,
      {
        name: "RSA-PSS",
        hash: "SHA-256",
      },
      true,   // Extractable (whether the key can be exported)
      ["verify"] // Key usages
    )
  }

  return keyPair

}

export async function importKeys(privateKeyPEM: string, publicKeyPEM: string, key: CryptoKey): Promise<SignAndEncryptKeyCollection> {

  // Verifying data
  const pubKeyPairFromPEM = await importPublicKey(fromPEM(publicKeyPEM));

  const encryptedPrivKeyFromPEM = fromPEM(privateKeyPEM);
  const privKeyPairFromPEM = await decryptPrivateKey(encryptedPrivKeyFromPEM, key);

  if (await decryptSecret(await encryptSecret("__", pubKeyPairFromPEM.encryptPublicKey ), privKeyPairFromPEM.decryptsPrivateKey) === "__") {
    return {
      ...pubKeyPairFromPEM,
      ...privKeyPairFromPEM,
    };
  }

  throw new Error("Keys are incorrect!");
}

export async function exportKeys(password: string): Promise<KeyPairResponse> {

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
