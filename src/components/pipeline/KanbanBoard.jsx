import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import KanbanColumn from './KanbanColumn.jsx'
import KanbanCard from './KanbanCard.jsx'
import CardModal from './CardModal.jsx'

export default function KanbanBoard({ columns, moveCard, updateCard, removeCard }) {
  const [activeCard, setActiveCard] = useState(null)
  const [editingCard, setEditingCard] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragStart(event) {
    const { active } = event
    for (const col of columns) {
      const card = col.cards.find((c) => c.id === active.id)
      if (card) {
        setActiveCard(card)
        break
      }
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveCard(null)
    if (!over) return

    // Determine target column: over could be a column id or card id
    let targetColumnId = over.id
    for (const col of columns) {
      if (col.cards.some((c) => c.id === over.id)) {
        targetColumnId = col.id
        break
      }
    }

    // Find source column
    let sourceColumnId = null
    for (const col of columns) {
      if (col.cards.some((c) => c.id === active.id)) {
        sourceColumnId = col.id
        break
      }
    }

    if (sourceColumnId && targetColumnId && sourceColumnId !== targetColumnId) {
      moveCard(active.id, targetColumnId)
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              onCardClick={setEditingCard}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="rotate-1 shadow-2xl opacity-90">
              <KanbanCard card={activeCard} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {editingCard && (
        <CardModal
          card={editingCard}
          onClose={() => setEditingCard(null)}
          onUpdate={(updates) => {
            updateCard(editingCard.id, updates)
            setEditingCard((c) => ({ ...c, ...updates }))
          }}
          onRemove={() => {
            removeCard(editingCard.id)
            setEditingCard(null)
          }}
        />
      )}
    </>
  )
}
