const COOKIE_MAX_AGE_DEFAULT = 60 * 60 * 24 * 7 // 7 days

export function setCookie(name: string, value: string | boolean, maxAge: number = COOKIE_MAX_AGE_DEFAULT): void {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`
}
