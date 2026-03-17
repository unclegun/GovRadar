import { useState } from 'react'
import { usePipeline } from '../hooks/usePipeline.js'
import { useWatchlist } from '../hooks/useWatchlist.js'
import KanbanBoard from '../components/pipeline/KanbanBoard.jsx'
import Button from '../components/ui/Button.jsx'
import Modal from '../components/ui/Modal.jsx'
import Select from '../components/ui/Select.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { truncate } from '../utils/formatters.js'

export default function Pipeline() {
  const { columns, moveCard, addCard, updateCard, removeCard } = usePipeline()
  const { watchlist } = useWatchlist()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedOppId, setSelectedOppId] = useState('')
  const [targetColumn, setTargetColumn] = useState('discovered')

  const totalCards = columns.reduce((sum, col) => sum + col.cards.length, 0)

  const allCardIds = new Set(columns.flatMap((col) => col.cards.map((c) => c.id)))
  const unwatchedOpps = watchlist.filter((w) => !allCardIds.has(w.id))

  const handleAddFromWatchlist = () => {
    const opp = watchlist.find((w) => w.id === selectedOppId)
    if (!opp) return
    addCard({ ...opp }, targetColumn)
    setShowAddModal(false)
    setSelectedOppId('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pipeline</h1>
          <p className="text-sm text-gray-500">{totalCards} opportunities tracked across {columns.length} stages</p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          + Add from Watchlist
        </Button>
      </div>

      {totalCards === 0 ? (
        <EmptyState
          icon="📋"
          title="Pipeline is empty"
          description="Add opportunities from your Watchlist or from the Opportunity Search page."
          action={
            <Button onClick={() => setShowAddModal(true)}>Add from Watchlist</Button>
          }
        />
      ) : (
        <KanbanBoard
          columns={columns}
          moveCard={moveCard}
          updateCard={updateCard}
          removeCard={removeCard}
        />
      )}

      {/* Add from watchlist modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add to Pipeline">
        <div className="space-y-4">
          {unwatchedOpps.length === 0 ? (
            <div className="text-sm text-gray-500 py-4 text-center">
              All watchlist items are already in your pipeline, or your watchlist is empty.
            </div>
          ) : (
            <>
              <Select
                label="Opportunity"
                value={selectedOppId}
                onChange={(e) => setSelectedOppId(e.target.value)}
              >
                <option value="">Select an opportunity…</option>
                {unwatchedOpps.map((opp) => (
                  <option key={opp.id} value={opp.id}>
                    {truncate(opp.title, 60)} — {opp.agency}
                  </option>
                ))}
              </Select>
              <Select
                label="Add to Column"
                value={targetColumn}
                onChange={(e) => setTargetColumn(e.target.value)}
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </Select>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button size="sm" onClick={handleAddFromWatchlist} disabled={!selectedOppId}>
                  Add to Pipeline
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
