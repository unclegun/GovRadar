import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export function PipelineCard({ card, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onSelect(card)}
      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm"
    >
      <p className="font-semibold text-slate-900">{card.title}</p>
      <p className="mt-1 text-xs text-slate-600">{card.agency}</p>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="rounded bg-slate-100 px-2 py-1">Fit {card.fitScore || 0}</span>
        <span>{card.dueDate || 'No due date'}</span>
      </div>
    </button>
  )
}
