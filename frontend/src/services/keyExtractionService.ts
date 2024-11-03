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

/**
 * Exporta una clave pública CryptoKey en el formato SPKI como un ArrayBuffer.
 *
 * @param {CryptoKey} key - La clave pública que se va a exportar.
 * @returns {Promise<ArrayBuffer>} - Una promesa que se resuelve a un ArrayBuffer que representa la clave pública exportada.
 *
 * La función utiliza la API de criptografía web para exportar la clave en un formato estándar SPKI, adecuado para compartir o almacenar.
 */
export async function exportPublicKey(key: CryptoKey): Promise<ArrayBuffer> {
  return await window.crypto.subtle.exportKey("spki", key);
}

/**
 * Cifra una clave privada CryptoKey usando una clave simétrica con el algoritmo AES-GCM.
 *
 * @param {CryptoKey} privateKey - La clave privada que se va a cifrar.
 * @param {CryptoKey} symmetricKey - La clave simétrica utilizada para cifrar la clave privada.
 * @returns {Promise<ArrayBuffer>} - Una promesa que se resuelve a un ArrayBuffer que contiene la clave privada cifrada y el IV.
 *
 * La función exporta la clave privada en formato PKCS8, la cifra con AES-GCM utilizando un IV aleatorio,
 * y combina el IV y los datos cifrados en un solo ArrayBuffer para su almacenamiento seguro.
 */
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

/**
 * Descifra una clave privada cifrada utilizando una clave simétrica e importa la clave como un objeto CryptoKey.
 *
 * @param {ArrayBuffer} encryptedData - La clave privada cifrada y el IV como un ArrayBuffer.
 * @param {CryptoKey} symmetricKey - La clave simétrica utilizada para descifrar la clave privada.
 * @returns {Promise<Pick<SignAndEncryptKeyCollection, "decryptsPrivateKey" | "signPrivateKey">>} - Una promesa que se resuelve a un objeto que contiene las claves privadas RSA-OAEP y RSA-PSS descifradas.
 *
 * La función extrae el IV y la clave privada cifrada del ArrayBuffer combinado, la descifra utilizando AES-GCM,
 * e importa la clave descifrada en dos formas: para descifrado con RSA-OAEP y para firma con RSA-PSS.
 */
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

/**
 * Importa una clave pública desde un ArrayBuffer y crea objetos CryptoKey para cifrado y verificación.
 *
 * @param {ArrayBuffer} keyBuffer - El ArrayBuffer que contiene la clave pública en formato SPKI.
 * @returns {Promise<Pick<SignAndEncryptKeyCollection, "encryptPublicKey" | "verifyPublicKey">>} - Una promesa que se resuelve a un objeto con CryptoKeys para cifrado RSA-OAEP y verificación RSA-PSS.
 *
 * La función importa la clave pública dos veces: una para usarla en cifrado RSA-OAEP y otra para la verificación de firmas RSA-PSS.
 */
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

/**
 * Importa una clave privada y una clave pública desde cadenas PEM y verifica su integridad utilizando una clave simétrica.
 *
 * @param {string} privateKeyPEM - La cadena PEM de la clave privada cifrada.
 * @param {string} publicKeyPEM - La cadena PEM de la clave pública.
 * @param {CryptoKey} key - La clave simétrica utilizada para descifrar la clave privada.
 * @returns {Promise<SignAndEncryptKeyCollection>} - Una promesa que se resuelve a un objeto que contiene el par de claves descifrado y verificado.
 *
 * La función convierte las cadenas PEM en ArrayBuffers, importa las claves y las verifica cifrando y descifrando un mensaje de prueba.
 * Si la prueba es exitosa, devuelve la colección completa de claves; de lo contrario, lanza un error.
 */
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

/**
 * Exporta un par de claves recién generado como cadenas PEM, cifrando la clave privada con una clave simétrica derivada de una contraseña.
 *
 * @param {string} password - La contraseña utilizada para generar la clave simétrica para cifrar la clave privada.
 * @returns {Promise<KeyPairResponse>} - Una promesa que se resuelve a un objeto que contiene las claves pública y privada en formato PEM.
 *
 * La función genera un par de claves, deriva una clave simétrica de la contraseña proporcionada, exporta la clave pública en formato PEM,
 * y cifra la clave privada con AES-GCM antes de exportarla en formato PEM. Devuelve ambas claves como un objeto de respuesta.
 */
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
