const APP_SALT = "a7-chat-api-keys-v1"
const ITERATIONS = 100000
const KEY_LENGTH = 256

function getEncoder() {
  return new TextEncoder()
}

function getDecoder() {
  return new TextDecoder()
}

export async function deriveKey(userId: string): Promise<CryptoKey> {
  const encoder = getEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(userId),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"],
  )

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(APP_SALT),
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"],
  )
}

export async function encrypt(
  plaintext: string,
  cryptoKey: CryptoKey,
): Promise<{ encrypted: string; iv: string }> {
  const encoder = getEncoder()
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encoder.encode(plaintext),
  )

  return {
    encrypted: bufferToBase64(encryptedBuffer),
    iv: bufferToBase64(iv),
  }
}

export async function decrypt(encrypted: string, iv: string, cryptoKey: CryptoKey): Promise<string> {
  const decoder = getDecoder()
  const ivBuffer = base64ToBuffer(iv)
  const dataBuffer = base64ToBuffer(encrypted)

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBuffer as Uint8Array<ArrayBuffer> },
    cryptoKey,
    dataBuffer as Uint8Array<ArrayBuffer>,
  )

  return decoder.decode(decryptedBuffer)
}

function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!)
  }
  return btoa(binary)
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}
