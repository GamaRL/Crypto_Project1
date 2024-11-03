/**
 * Convierte un ArrayBuffer a una cadena codificada en Base64.
 *
 * @param {ArrayBuffer} buffer - El buffer que se va a convertir a Base64.
 * @returns {string} - Una cadena en formato Base64 que representa el buffer.
 *
 * La función crea un `Uint8Array` a partir del buffer proporcionado y usa
 * `String.fromCharCode` para convertirlo en una cadena binaria, que luego
 * se codifica a Base64 usando `btoa`.
 */
export function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

/**
 * Convierte un ArrayBuffer a una cadena en formato PEM.
 *
 * @param {ArrayBuffer} buffer - El buffer que se va a convertir a formato PEM.
 * @param {string} type - El tipo de PEM (por ejemplo, "PUBLIC KEY", "PRIVATE KEY").
 * @returns {string} - Una cadena en formato PEM, incluyendo el encabezado y el pie.
 *
 * La función primero convierte el buffer a una cadena Base64 y luego la formatea
 * en formato PEM, añadiendo los encabezados y dividiendo las líneas cada 64 caracteres.
 */
export function toPEM(buffer: ArrayBuffer, type: string): string {

  const base64 = bufferToBase64(buffer);
  return `-----BEGIN ${type}-----\n` +
    base64.match(/.{1,64}/g)?.join('\n') +
    `\n-----END ${type}-----`;
}

/**
 * Convierte una cadena en formato PEM a un ArrayBuffer.
 *
 * @param {string} pem - La cadena PEM que se va a convertir.
 * @returns {ArrayBuffer} - Una representación en ArrayBuffer del contenido PEM.
 *
 * La función elimina los encabezados, pies y cualquier espacio en blanco del PEM,
 * luego decodifica el contenido Base64 a una cadena binaria usando `atob`.
 * Finalmente, convierte la cadena binaria en un `ArrayBuffer` para su uso posterior.
 */
export function fromPEM(pem: string): ArrayBuffer {
  // Remove the PEM header and footer
  const pemContent = pem.replace(/-----BEGIN.*-----|-----END.*-----|\s+/g, '');

  // Decode the base64 content into binary
  const binary = atob(pemContent);

  // Convert the binary string into an ArrayBuffer
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    view[i] = binary.charCodeAt(i);
  }

  return buffer;
}