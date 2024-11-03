import { bufferToBase64 } from "./utilities";

/**
 * Firma un mensaje utilizando una clave privada y el algoritmo RSA-PSS.
 *
 * @param {string} message - El mensaje de texto que se desea firmar.
 * @param {CryptoKey} privateKey - La clave privada que se usará para generar la firma.
 * @returns {Promise<string>} - Una promesa que resuelve en la firma del mensaje en formato Base64.
 *
 * La función convierte el mensaje en un formato binario, lo firma usando la clave privada y RSA-PSS,
 * y luego devuelve la firma como una cadena en Base64.
 */
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

/**
 * Verifica la autenticidad de un mensaje utilizando una clave pública y el algoritmo RSA-PSS.
 *
 * @param {string} encodedMessageBase64 - La firma del mensaje en formato Base64.
 * @param {string} message - El mensaje original que se desea verificar.
 * @param {CryptoKey} publicKey - La clave pública que se usará para verificar la firma.
 * @returns {Promise<boolean>} - Una promesa que resuelve en `true` si la firma es válida, o `false` si no lo es.
 *
 * La función convierte la firma y el mensaje en un formato binario y utiliza la clave pública
 * para verificar la autenticidad de la firma con el mensaje.
 */
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