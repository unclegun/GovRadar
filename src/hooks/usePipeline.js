import { STORAGE_KEYS } from '../constants/storageKeys'
import { defaultPipelineColumns } from '../data/defaults'
import { useLocalStorage } from './useLocalStorage'

export function usePipeline() {
  const [columns, setColumns] = useLocalStorage(STORAGE_KEYS.pipeline, defaultPipelineColumns)

  const addCard = (columnId, card) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? {
              ...column,
              items: [{ id: crypto.randomUUID(), ...card }, ...column.items],
            }
          : column,
      ),
    )
  }

  const updateCard = (cardId, updates) => {
    setColumns((prev) =>
      prev.map((column) => ({
        ...column,
        items: column.items.map((item) => (item.id === cardId ? { ...item, ...updates } : item)),
      })),
    )
  }

  return { columns, setColumns, addCard, updateCard }
}
