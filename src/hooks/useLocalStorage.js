import { useEffect, useMemo, useState } from 'react'
import { getStoredValue, setStoredValue } from '../services/localStorageService'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => getStoredValue(key, initialValue))

  useEffect(() => {
    setStoredValue(key, value)
  }, [key, value])

  const reset = useMemo(() => () => setValue(initialValue), [initialValue])

  return [value, setValue, reset]
}
