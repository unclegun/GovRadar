import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { formatDate } from '../../utils/formatters.js'

export default function KanbanCard({ card, onClick, isDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`bg-white rounded-md border border-gray-200 p-3 cursor-pointer shadow-sm hover:shadow-md hover:border-blue-300 transition-all ${
        isDragging ? 'shadow-xl rotate-2' : ''
      }`}
    >
      <div className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">
        {card.title || 'Untitled'}
      </div>
      {card.agency && (
        <div className="text-xs text-gray-500 mt-1 truncate">{card.agency}</div>
      )}
      <div className="flex items-center justify-between mt-2">
        {card.dueDate && (
          <span className="text-xs text-gray-400">{formatDate(card.dueDate)}</span>
        )}
        {card.estimatedValue && (
          <span className="text-xs text-blue-600 font-medium">
            ${(card.estimatedValue / 1000000).toFixed(1)}M
          </span>
        )}
      </div>
      {card.notes && (
        <div className="mt-1.5 text-xs text-gray-500 italic truncate">{card.notes}</div>
      )}
    </div>
  )
}
