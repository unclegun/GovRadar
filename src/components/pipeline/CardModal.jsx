import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Input from '../ui/Input.jsx'
import Textarea from '../ui/Textarea.jsx'
import { formatDate, formatCurrency } from '../../utils/formatters.js'

export default function CardModal({ card, onClose, onUpdate, onRemove }) {
  const [notes, setNotes] = useState(card.notes || '')
  const [title, setTitle] = useState(card.title || '')

  const handleSave = () => {
    onUpdate({ title, notes })
    onClose()
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Pipeline Card" size="md">
      <div className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3 text-sm">
          {card.agency && (
            <div>
              <span className="text-xs text-gray-500">Agency</span>
              <div className="font-medium text-gray-900">{card.agency}</div>
            </div>
          )}
          {card.naics && (
            <div>
              <span className="text-xs text-gray-500">NAICS</span>
              <div className="font-mono font-medium text-gray-900">{card.naics}</div>
            </div>
          )}
          {card.dueDate && (
            <div>
              <span className="text-xs text-gray-500">Due Date</span>
              <div className="font-medium text-gray-900">{formatDate(card.dueDate)}</div>
            </div>
          )}
          {card.estimatedValue && (
            <div>
              <span className="text-xs text-gray-500">Est. Value</span>
              <div className="font-medium text-blue-700">{formatCurrency(card.estimatedValue)}</div>
            </div>
          )}
          {card.setAside && (
            <div>
              <span className="text-xs text-gray-500">Set-Aside</span>
              <div className="font-medium text-gray-900">{card.setAside}</div>
            </div>
          )}
          {card.solicitationNumber && (
            <div>
              <span className="text-xs text-gray-500">Solicitation #</span>
              <div className="font-mono text-xs text-gray-700">{card.solicitationNumber}</div>
            </div>
          )}
        </div>

        <Textarea
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes, action items, contacts..."
          rows={4}
        />

        {card.samUrl && (
          <a
            href={card.samUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            ↗ View on SAM.gov
          </a>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <Button variant="danger" size="sm" onClick={() => { if (window.confirm('Remove this card?')) onRemove() }}>
            Remove Card
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
