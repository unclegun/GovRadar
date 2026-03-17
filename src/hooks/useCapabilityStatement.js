import { useLocalStorage } from './useLocalStorage.js'
import { STORAGE_KEYS } from '../utils/storage.js'
import { defaultCapabilityStatement } from '../data/mockCapabilityStatement.js'

export function useCapabilityStatement() {
  return useLocalStorage(STORAGE_KEYS.CAPABILITY, defaultCapabilityStatement)
}
