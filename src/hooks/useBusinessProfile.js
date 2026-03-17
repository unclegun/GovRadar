import { STORAGE_KEYS } from '../constants/storageKeys'
import { defaultBusinessProfile } from '../data/defaults'
import { useLocalStorage } from './useLocalStorage'

export function useBusinessProfile() {
  const [profile, setProfile, resetProfile] = useLocalStorage(
    STORAGE_KEYS.businessProfile,
    defaultBusinessProfile,
  )

  const updateField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  return { profile, setProfile, updateField, resetProfile }
}
