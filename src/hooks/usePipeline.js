import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage.js'
import { STORAGE_KEYS } from '../utils/storage.js'

const DEFAULT_COLUMNS = [
  { id: 'discovered', title: 'Discovered', cards: [] },
  { id: 'reviewing', title: 'Reviewing', cards: [] },
  { id: 'partnering', title: 'Partnering', cards: [] },
  { id: 'proposal-ready', title: 'Proposal Ready', cards: [] },
  { id: 'submitted', title: 'Submitted', cards: [] },
  { id: 'archived', title: 'Archived', cards: [] },
]

export function usePipeline() {
  const [columns, setColumns] = useLocalStorage(STORAGE_KEYS.PIPELINE, DEFAULT_COLUMNS)

  const moveCard = useCallback((cardId, toColumnId) => {
    setColumns((prev) => {
      let card = null
      const updated = prev.map((col) => {
        const found = col.cards.find((c) => c.id === cardId)
        if (found) {
          card = found
          return { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
        }
        return col
      })
      if (!card) return prev
      return updated.map((col) =>
        col.id === toColumnId ? { ...col, cards: [...col.cards, card] } : col
      )
    })
  }, [setColumns])

  const addCard = useCallback((card, columnId) => {
    setColumns((prev) => {
      const targetId = columnId || 'discovered'
      return prev.map((col) =>
        col.id === targetId
          ? {
              ...col,
              cards: [
                ...col.cards,
                {
                  id: `card-${Date.now()}`,
                  createdAt: new Date().toISOString(),
                  notes: '',
                  ...card,
                },
              ],
            }
          : col
      )
    })
  }, [setColumns])

  const updateCard = useCallback((cardId, updates) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.map((c) => (c.id === cardId ? { ...c, ...updates } : c)),
      }))
    )
  }, [setColumns])

  const removeCard = useCallback((cardId) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.filter((c) => c.id !== cardId),
      }))
    )
  }, [setColumns])

  return { columns, moveCard, addCard, updateCard, removeCard }
}
