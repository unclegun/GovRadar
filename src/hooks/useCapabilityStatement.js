import { STORAGE_KEYS } from '../constants/storageKeys'
import { defaultCapabilityStatement } from '../data/defaults'
import { useLocalStorage } from './useLocalStorage'

export function useCapabilityStatement() {
  const [statement, setStatement, resetStatement] = useLocalStorage(
    STORAGE_KEYS.capabilityStatement,
    defaultCapabilityStatement,
  )

  return { statement, setStatement, resetStatement }
}
