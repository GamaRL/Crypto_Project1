import { bufferToBase64 } from "./utilities";

// Signs a message using the private key RSA-PSS
export async function signMessage(message: string, privateKey: CryptoKey): Promise<string> {
  const textEncoder = new TextEncoder();
  const encodedMessage = textEncoder.encode(message)
  // Using RSA-PSS to sign the encoded message using salt length of 32
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

// Verifies the correct signing of the encoded message with RSA-PSS
export async function verifyMessage(encodedMessageBase64: string, message: string, publicKey: CryptoKey): Promise<boolean> {
  // Decodes the message from base64
  const decodedMessage = Buffer.from(encodedMessageBase64, 'base64');
  const siganture = new Uint8Array(decodedMessage);

  const textEncoder = new TextEncoder();
  // Encodes the original message
  const encodedMessage = textEncoder.encode(message)

  // Verifies the authenticity of the digital signature for the message using window.crypto.subtle.verify
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
