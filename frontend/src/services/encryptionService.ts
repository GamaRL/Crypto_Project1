import { bufferToBase64 } from "./utilities";

export async function encryptSecret(secret: string, publicKey: CryptoKey): Promise<string> {
  const textEncoder = new TextEncoder();
  const encoded = textEncoder.encode(secret)

  const response = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    encoded,
  );

  return bufferToBase64(response);
}

export async function decryptSecret(encodedSecretBase64: string, privateKey: CryptoKey) {

  const encryptedSecret = Buffer.from(encodedSecretBase64, 'base64').buffer;

  const decryptedSecret = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    encryptedSecret,
  );


  const decoder = new TextDecoder();
  return decoder.decode(decryptedSecret); // Convert ArrayBuffer to string
}

export async function encryptMessage(message: string, symmetricKey: CryptoKey): Promise<string> {
  const textEncoder = new TextEncoder();
  const encoded = textEncoder.encode(message)

  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
  const encryptedPrivateKey = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    symmetricKey,
    encoded
  );

  // Combine IV and encrypted key
  const combinedBuffer = new Uint8Array(iv.length + encryptedPrivateKey.byteLength);
  combinedBuffer.set(iv);
  combinedBuffer.set(new Uint8Array(encryptedPrivateKey), iv.length);

  return bufferToBase64(combinedBuffer.buffer); // Return the combined buffer decoded in base 64
}

export async function decryptMessage(encodedMessageBase64: string, symmetricKey: CryptoKey): Promise<string> {
  const decodedMessage = Buffer.from(encodedMessageBase64, 'base64');
  const combinedArray = new Uint8Array(decodedMessage);
  const iv = combinedArray.slice(0, 12); // Extract IV
  const encryptedPrivateKey = combinedArray.slice(12); // Extract encrypted key

  const decryptedMessage = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    symmetricKey,
    encryptedPrivateKey
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedMessage); // Convert ArrayBuffer to string
}