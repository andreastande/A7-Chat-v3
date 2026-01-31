// =============================================================================
// Device-Bound Encryption
// =============================================================================
//
// API keys are encrypted using AES-GCM with a key derived from:
// 1. A device fingerprint (browser characteristics)
// 2. A random salt (stored in localStorage)
//
// This means keys are tied to the specific browser/device and cannot be
// decrypted elsewhere. If browser data is cleared, keys must be re-added.
// =============================================================================

const SALT_KEY = "encryption-salt"
const FINGERPRINT_KEY = "encryption-fingerprint"
const ALGORITHM = "AES-GCM"
const KEY_LENGTH = 256
const ITERATIONS = 310000

let cachedKey: CryptoKey | null = null

/**
 * Generate a fingerprint from browser characteristics.
 * Not for tracking - just to tie encryption to this device.
 */
function generateDeviceFingerprint(): string {
  const components = [
    navigator.userAgent,
    `${screen.width}x${screen.height}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.language,
  ]
  return components.join("|")
}

/**
 * Hash a fingerprint for storage comparison.
 * Uses a simple hash since we just need to detect changes.
 */
function hashFingerprint(fingerprint: string): string {
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString(36)
}

/**
 * Check if fingerprint has changed since last use.
 * If changed, clears all encryption data for a fresh start.
 */
function validateFingerprint(fingerprint: string): void {
  const currentHash = hashFingerprint(fingerprint)
  const storedHash = localStorage.getItem(FINGERPRINT_KEY)

  if (storedHash && storedHash !== currentHash) {
    // Fingerprint changed - clear encryption data
    localStorage.removeItem(SALT_KEY)
    localStorage.removeItem(FINGERPRINT_KEY)
    cachedKey = null
    console.warn("Device fingerprint changed. API keys will need to be re-added.")
  }

  localStorage.setItem(FINGERPRINT_KEY, currentHash)
}

/**
 * Get or create the encryption salt.
 * Salt is stored in localStorage and generated once per browser.
 */
async function getSalt(): Promise<Uint8Array<ArrayBuffer>> {
  const stored = localStorage.getItem(SALT_KEY)
  if (stored) {
    const bytes = atob(stored)
    const salt = new Uint8Array(bytes.length)
    for (let i = 0; i < bytes.length; i++) {
      salt[i] = bytes.charCodeAt(i)
    }
    return salt
  }

  const salt = crypto.getRandomValues(new Uint8Array(16))
  localStorage.setItem(SALT_KEY, btoa(String.fromCharCode(...salt)))
  return salt
}

/**
 * Derive an AES-GCM key from fingerprint and salt using PBKDF2.
 */
async function deriveKey(fingerprint: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(fingerprint), "PBKDF2", false, ["deriveKey"])

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"],
  )
}

/**
 * Get the encryption key, deriving it if not cached.
 * Validates fingerprint on first call to detect device changes.
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey

  const fingerprint = generateDeviceFingerprint()
  validateFingerprint(fingerprint)

  const salt = await getSalt()
  cachedKey = await deriveKey(fingerprint, salt)
  return cachedKey
}

/**
 * Encrypt a plaintext string.
 * Returns base64-encoded encrypted data and IV.
 */
export async function encrypt(plaintext: string): Promise<{ encrypted: string; iv: string }> {
  const key = await getEncryptionKey()
  const encoder = new TextEncoder()
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const encrypted = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, encoder.encode(plaintext))

  return {
    encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
  }
}

/**
 * Decrypt base64-encoded data using the stored IV.
 */
export async function decrypt(encrypted: string, iv: string): Promise<string> {
  const key = await getEncryptionKey()

  const encryptedBuffer = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0))
  const ivBuffer = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0))

  const decrypted = await crypto.subtle.decrypt({ name: ALGORITHM, iv: ivBuffer }, key, encryptedBuffer)

  return new TextDecoder().decode(decrypted)
}
