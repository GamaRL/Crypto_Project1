import { bufferToBase64 } from "./utilities";

/**
 * Cifra un texto secreto utilizando una clave pública con el algoritmo RSA-OAEP.
 *
 * @param {string} secret - El texto secreto que se desea encriptar.
 * @param {CryptoKey} publicKey - La clave pública que se usará para la encriptación.
 * @returns {Promise<string>} - Una promesa que resuelve a la cadena encriptada en formato Base64.
 *
 * La función utiliza el API Web Cryptography para encriptar el texto secreto. 
 * Primero, convierte el texto en un ArrayBuffer utilizando TextEncoder y 
 * luego emplea `crypto.subtle.encrypt` para encriptarlo con la clave pública proporcionada.
 * Finalmente, convierte el resultado de la encriptación a una cadena Base64 
 * antes de retornarla.
 */
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

/**
 * escifra un texto cifrado en formato Base64 utilizando una clave privada con el algoritmo RSA-OAEP.
 *
 * @param {string} encodedSecretBase64 - El texto cifrado en formato Base64 que se desea desencriptar.
 * @param {CryptoKey} privateKey - La clave privada que se usará para la desencriptación.
 * @returns {Promise<string>} - Una promesa que resuelve en el texto desencriptado en formato de cadena.
 *
 * La función convierte el texto Base64 en un ArrayBuffer, usa la API Web Cryptography para desencriptar
 * los datos, y finalmente decodifica el resultado a una cadena legible.
 */
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

/**
 * Cifra un mensaje usando una clave simétrica y el algoritmo AES-GCM.
 *
 * @param {string} message - El mensaje de texto que se desea cifrar.
 * @param {CryptoKey} symmetricKey - La clave simétrica que se usará para el cifrado.
 * @returns {Promise<string>} - Una promesa que resuelve en el mensaje cifrado en formato Base64.
 *
 * La función genera un vector de inicialización (IV) aleatorio, cifra el mensaje, y combina el IV
 * con el mensaje cifrado antes de convertirlo a Base64.
 */
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

/**
 * Descifra un mensaje cifrado en formato Base64 utilizando una clave simétrica y el algoritmo AES-GCM.
 *
 * @param {string} encodedMessageBase64 - El mensaje cifrado en Base64 que se desea descifrar.
 * @param {CryptoKey} symmetricKey - La clave simétrica que se usará para la desencriptación.
 * @returns {Promise<string>} - Una promesa que resuelve en el mensaje descifrado en formato de texto.
 *
 * La función separa el vector de inicialización (IV) del mensaje cifrado, realiza la desencriptación,
 * y convierte el resultado en una cadena de texto legible.
 */
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