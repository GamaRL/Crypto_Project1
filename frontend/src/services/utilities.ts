export function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export function toPEM(buffer: ArrayBuffer, type: string): string {

  const base64 = bufferToBase64(buffer);
  return `-----BEGIN ${type}-----\n` +
    base64.match(/.{1,64}/g)?.join('\n') +
    `\n-----END ${type}-----`;
}

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