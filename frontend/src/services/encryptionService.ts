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