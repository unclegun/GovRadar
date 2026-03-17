import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return defaultValue
      return JSON.parse(raw)
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error('useLocalStorage write error:', err)
    }
  }, [key, value])

  const setStoredValue = useCallback((newValue) => {
    setValue((prev) =>
      typeof newValue === 'function' ? newValue(prev) : newValue
    )
  }, [])

  return [value, setStoredValue]
}
