import { bufferToBase64 } from "./utilities";

export async function signMessage(message: string, privateKey: CryptoKey): Promise<string> {
  const textEncoder = new TextEncoder();
  const encodedMessage = textEncoder.encode(message)

  const signature = await window.crypto.subtle.sign(
    {
      name: "RSA-PSS",
      saltLength: 32,
    },
    privateKey,
    encodedMessage
  );

  return bufferToBase64(signature); // Return the combined buffer decoded in base 64
}

export async function verifyMessage(encodedMessageBase64: string, message: string, publicKey: CryptoKey): Promise<boolean> {
  const decodedMessage = Buffer.from(encodedMessageBase64, 'base64');
  const siganture = new Uint8Array(decodedMessage);

  const textEncoder = new TextEncoder();
  const encodedMessage = textEncoder.encode(message)

  return await window.crypto.subtle.verify(
    {
      name: "RSA-PSS",
      saltLength: 32,
    },
    publicKey,
    siganture,
    encodedMessage
  );

}