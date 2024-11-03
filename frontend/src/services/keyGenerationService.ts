/**
 * Genera una clave criptográfica simétrica derivada de una contraseña mediante PBKDF2.
 * 
 * @param password - La contraseña de la cual se derivará la clave.
 * @returns Una `Promise` que se resuelve en una `CryptoKey` para operaciones de cifrado y descifrado.
 * 
 * Descripción detallada:
 * 1. Se utiliza un `TextEncoder` para convertir la contraseña en un formato adecuado (UTF-8) para la derivación.
 * 2. Se define una sal fija (`fixedSalt`), que es un conjunto de bytes constante. Se dejan fijos para poder generar
 *    la misma llave a partir del mismo password.
 * 3. Se especifica el número de iteraciones (`iterations`) y el algoritmo de hash (`SHA-256`) para PBKDF2.
 * 4. Se importa la contraseña como un `keyMaterial` crudo, que se utilizará como material base para la derivación de la clave.
 * 5. Se deriva una clave simétrica con PBKDF2:
 *    - Se usa la sal fija y el número de iteraciones para reforzar la seguridad de la contraseña.
 *    - Se genera una clave para el algoritmo `AES-GCM` de 256 bits, utilizada comúnmente para el cifrado simétrico seguro.
 * 6. La clave derivada no es extraíble (`extractable: false`), lo que significa que no se puede exportar en su forma original.
 * 7. Se permite que la clave derivada se utilice para las operaciones de `encrypt` (cifrado) y `decrypt` (descifrado).
 * 8. La función retorna la clave simétrica derivada, lista para su uso en operaciones criptográficas.
 */
export async function generateSymmetricKeyFromPassword(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();

  // Define a fixed salt (must be consistent)
  const fixedSalt = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
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

/**
 * Genera un par de claves asimétricas (pública y privada) usando el algoritmo RSA-OAEP.
 * 
 * @returns Una `Promise` que se resuelve en un `CryptoKeyPair` que contiene:
 *          - Una clave pública para cifrar.
 *          - Una clave privada para descifrar.
 * 
 * Desglose del código:
 * 1. Se utiliza el método `window.crypto.subtle.generateKey` para crear un par de claves criptográficas.
 * 
 * Configuración del algoritmo:
 * - **name**: "RSA-OAEP" es el algoritmo de clave pública que se usa comúnmente para cifrar datos de manera segura.
 * - **modulusLength**: La longitud del módulo RSA es de 2048 bits, que es un tamaño estándar y seguro para la mayoría de los propósitos criptográficos.
 * - **publicExponent**: Se establece en `new Uint8Array([1, 0, 1])`, que es el valor común `0x010001` (o 65537 en decimal). Es un exponente público ampliamente utilizado en RSA debido a su equilibrio entre seguridad y eficiencia.
 * - **hash**: "SHA-256" es el algoritmo de hash utilizado junto con RSA-OAEP para una seguridad adicional durante el cifrado.
 * 
 * Configuración de la clave:
 * - **true**: Especifica que las claves generadas son extractables, lo que significa que pueden ser exportadas para su almacenamiento o uso fuera del entorno actual.
 * - **Key usages**: Se indica que la clave pública se usará para "encrypt" (cifrar) y la clave privada para "decrypt" (descifrar).
 * 
 * @returns El `keyPair` generado, que es un objeto `CryptoKeyPair` que contiene:
 *          - `keyPair.publicKey`: Clave pública que puede compartirse con otros para cifrar mensajes.
 *          - `keyPair.privateKey`: Clave privada que debe mantenerse segura y se usa para descifrar mensajes.
 */
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
