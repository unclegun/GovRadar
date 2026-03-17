import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import KanbanCard from './KanbanCard.jsx'

const columnColors = {
  discovered: 'border-t-slate-400',
  reviewing: 'border-t-blue-400',
  partnering: 'border-t-indigo-400',
  'proposal-ready': 'border-t-purple-400',
  submitted: 'border-t-amber-400',
  archived: 'border-t-gray-300',
}

export default function KanbanColumn({ column, onCardClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const color = columnColors[column.id] || 'border-t-slate-400'

  return (
    <div className="flex-shrink-0 w-64">
      <div className={`rounded-lg border-t-2 ${color} bg-gray-100 flex flex-col min-h-[400px] ${isOver ? 'ring-2 ring-blue-400 ring-opacity-60' : ''}`}>
        {/* Column header */}
        <div className="px-3 py-2.5 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            {column.title}
          </span>
          <span className="text-xs font-bold text-gray-500 bg-white rounded-full px-1.5 py-0.5 border border-gray-200">
            {column.cards.length}
          </span>
        </div>

        {/* Cards */}
        <div ref={setNodeRef} className="flex-1 px-2 pb-2 space-y-2 min-h-[60px]">
          <SortableContext items={column.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            {column.cards.map((card) => (
              <KanbanCard key={card.id} card={card} onClick={() => onCardClick(card)} />
            ))}
          </SortableContext>
          {column.cards.length === 0 && (
            <div className="h-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
              <span className="text-xs text-gray-400">Drop here</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
