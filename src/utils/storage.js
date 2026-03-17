export const STORAGE_KEYS = {
  PROFILE: 'sscr_profile',
  WATCHLIST: 'sscr_watchlist',
  PRIMES: 'sscr_primes',
  PIPELINE: 'sscr_pipeline',
  PRESETS: 'sscr_presets',
  CAPABILITY: 'sscr_capability',
  PREFERENCES: 'sscr_preferences',
}

export function getItem(key) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error('localStorage setItem error:', err)
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.error('localStorage removeItem error:', err)
  }
}
