import { useLocalStorage } from './useLocalStorage.js'
import { STORAGE_KEYS } from '../utils/storage.js'

const DEFAULT_PROFILE = {
  companyName: '',
  description: '',
  keywords: [],
  preferredAgencies: [],
  naicsCodes: [],
  contractSizeMin: 100000,
  contractSizeMax: 5000000,
  certifications: [],
  techKeywords: [],
  excludedKeywords: [],
  website: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
}

export function useBusinessProfile() {
  return useLocalStorage(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE)
}
