const isBrowser = typeof window !== 'undefined'

export function getStoredValue(key, fallback) {
  if (!isBrowser) return fallback

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch (error) {
    console.warn(`Failed to parse localStorage key: ${key}`, error)
    return fallback
  }
}

export function setStoredValue(key, value) {
  if (!isBrowser) return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Failed to store localStorage key: ${key}`, error)
  }
}

export function removeStoredValue(key) {
  if (!isBrowser) return
  window.localStorage.removeItem(key)
}
