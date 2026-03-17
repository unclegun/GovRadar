import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage.js'
import { STORAGE_KEYS } from '../utils/storage.js'

export function useWatchlist() {
  const [watchlist, setWatchlist] = useLocalStorage(STORAGE_KEYS.WATCHLIST, [])

  const addToWatchlist = useCallback((opportunity) => {
    setWatchlist((prev) => {
      if (prev.some((item) => item.id === opportunity.id)) return prev
      return [
        ...prev,
        {
          ...opportunity,
          status: 'New',
          notes: '',
          priority: false,
          reminderDate: '',
          savedAt: new Date().toISOString(),
        },
      ]
    })
  }, [setWatchlist])

  const updateItem = useCallback((id, updates) => {
    setWatchlist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }, [setWatchlist])

  const removeFromWatchlist = useCallback((id) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id))
  }, [setWatchlist])

  const isWatched = useCallback(
    (id) => watchlist.some((item) => item.id === id),
    [watchlist]
  )

  return { watchlist, addToWatchlist, updateItem, removeFromWatchlist, isWatched }
}
