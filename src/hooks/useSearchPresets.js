import { STORAGE_KEYS } from '../constants/storageKeys'
import { useLocalStorage } from './useLocalStorage'

export function useSearchPresets() {
  const [presets, setPresets] = useLocalStorage(STORAGE_KEYS.searchPresets, [])

  const savePreset = (preset) => {
    setPresets((prev) => [{ ...preset, id: crypto.randomUUID() }, ...prev])
  }

  const deletePreset = (presetId) => {
    setPresets((prev) => prev.filter((preset) => preset.id !== presetId))
  }

  return { presets, savePreset, deletePreset }
}
