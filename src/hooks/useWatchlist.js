import { STORAGE_KEYS } from '../constants/storageKeys'
import { useLocalStorage } from './useLocalStorage'

export function useWatchlist() {
  const [watchlist, setWatchlist] = useLocalStorage(STORAGE_KEYS.watchlist, [])

  const saveOpportunity = (opportunity) => {
    setWatchlist((prev) => {
      if (prev.find((item) => item.id === opportunity.id)) return prev
      return [
        {
          ...opportunity,
          status: 'New',
          notes: '',
          priority: false,
          reminderDate: opportunity.dueDate || '',
          savedAt: new Date().toISOString(),
        },
        ...prev,
      ]
    })
  }

  const updateItem = (id, updates) => {
    setWatchlist((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const removeItem = (id) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id))
  }

  return { watchlist, saveOpportunity, updateItem, removeItem, setWatchlist }
}
