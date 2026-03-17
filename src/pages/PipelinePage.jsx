import { useMemo, useState } from 'react'
import { DndContext, PointerSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card } from '../components/ui/Card'
import { usePipeline } from '../hooks/usePipeline'
import { useWatchlist } from '../hooks/useWatchlist'
import { PipelineCard } from '../components/pipeline/PipelineCard'

function findCardContainer(columns, cardId) {
  for (const column of columns) {
    if (column.items.find((item) => item.id === cardId)) return column.id
  }
  return null
}

export function PipelinePage() {
  const { columns, setColumns, addCard, updateCard } = usePipeline()
  const { watchlist } = useWatchlist()
  const [selectedWatchlistId, setSelectedWatchlistId] = useState('')
  const [activeCard, setActiveCard] = useState(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const watchlistOptions = useMemo(
    () => watchlist.filter((item) => !columns.some((col) => col.items.some((card) => card.sourceId === item.id))),
    [watchlist, columns],
  )

  const addFromWatchlist = () => {
    const selected = watchlist.find((item) => item.id === selectedWatchlistId)
    if (!selected) return

    addCard('discovered', {
      sourceId: selected.id,
      title: selected.title,
      agency: selected.agency,
      dueDate: selected.dueDate,
      fitScore: selected.fitScore || 0,
      notes: selected.notes || '',
    })

    setSelectedWatchlistId('')
  }

  const handleDragEnd = ({ active, over }) => {
    if (!over) return

    const sourceColumnId = findCardContainer(columns, active.id)
    const targetColumnId = columns.find((column) => column.id === over.id)
      ? over.id
      : findCardContainer(columns, over.id)

    if (!sourceColumnId || !targetColumnId) return
    if (sourceColumnId === targetColumnId && active.id === over.id) return

    const sourceColumn = columns.find((column) => column.id === sourceColumnId)
    const targetColumn = columns.find((column) => column.id === targetColumnId)

    const movedCard = sourceColumn.items.find((item) => item.id === active.id)
    if (!movedCard) return

    setColumns((prev) =>
      prev.map((column) => {
        if (column.id === sourceColumnId) {
          return {
            ...column,
            items: column.items.filter((item) => item.id !== active.id),
          }
        }

        if (column.id === targetColumnId) {
          return {
            ...column,
            items: [movedCard, ...column.items.filter((item) => item.id !== active.id)],
          }
        }

        return column
      }),
    )
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Pipeline</h1>
        <p className="text-sm text-slate-600">Track opportunities from discovery through submission.</p>
      </header>

      <Card title="Create Card from Watchlist">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedWatchlistId}
            onChange={(event) => setSelectedWatchlistId(event.target.value)}
            className="min-w-72 rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Select saved opportunity</option>
            {watchlistOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <button onClick={addFromWatchlist} type="button" className="rounded bg-brand-800 px-4 py-2 text-sm font-semibold text-white">
            Add to Discovered
          </button>
        </div>
      </Card>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid gap-3 xl:grid-cols-3 2xl:grid-cols-6">
          {columns.map((column) => (
            <section key={column.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <h2 className="mb-2 text-sm font-semibold text-slate-800">{column.title}</h2>
              <SortableContext items={column.items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                <div id={column.id} className="space-y-2">
                  {column.items.map((card) => (
                    <PipelineCard key={card.id} card={card} onSelect={setActiveCard} />
                  ))}
                </div>
              </SortableContext>
            </section>
          ))}
        </div>
      </DndContext>

      {activeCard && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-slate-900/30 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-start justify-between">
              <h3 className="text-lg font-semibold">Edit Pipeline Card</h3>
              <button type="button" onClick={() => setActiveCard(null)} className="rounded border px-2 py-1 text-sm">
                Close
              </button>
            </div>
            <div className="grid gap-2">
              <input
                value={activeCard.title}
                onChange={(event) => setActiveCard((prev) => ({ ...prev, title: event.target.value }))}
                className="rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                value={activeCard.agency}
                onChange={(event) => setActiveCard((prev) => ({ ...prev, agency: event.target.value }))}
                className="rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={activeCard.dueDate || ''}
                onChange={(event) => setActiveCard((prev) => ({ ...prev, dueDate: event.target.value }))}
                className="rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={activeCard.fitScore || 0}
                onChange={(event) => setActiveCard((prev) => ({ ...prev, fitScore: Number(event.target.value) }))}
                className="rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <textarea
                rows={4}
                value={activeCard.notes || ''}
                onChange={(event) => setActiveCard((prev) => ({ ...prev, notes: event.target.value }))}
                className="rounded border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                updateCard(activeCard.id, activeCard)
                setActiveCard(null)
              }}
              className="mt-4 rounded bg-brand-800 px-4 py-2 text-sm font-semibold text-white"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
