import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage.js'
import { STORAGE_KEYS } from '../utils/storage.js'

export function useSearchPresets() {
  const [presets, setPresets] = useLocalStorage(STORAGE_KEYS.PRESETS, [])

  const savePreset = useCallback((preset) => {
    setPresets((prev) => [
      ...prev,
      {
        id: `preset-${Date.now()}`,
        createdAt: new Date().toISOString(),
        name: preset.name || 'Unnamed Preset',
        keyword: preset.keyword || '',
        filters: preset.filters || {},
        notes: preset.notes || '',
      },
    ])
  }, [setPresets])

  const deletePreset = useCallback((id) => {
    setPresets((prev) => prev.filter((p) => p.id !== id))
  }, [setPresets])

  const runPreset = useCallback((preset) => {
    return {
      keyword: preset.keyword || '',
      ...preset.filters,
    }
  }, [])

  return { presets, savePreset, deletePreset, runPreset }
}
