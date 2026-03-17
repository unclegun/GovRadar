import { useState } from 'react'
import { useWatchlist } from '../hooks/useWatchlist.js'
import { exportOpportunitiesToCSV } from '../utils/csvExport.js'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Select from '../components/ui/Select.jsx'
import Textarea from '../components/ui/Textarea.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { formatDate, formatCurrency, formatDaysUntil, truncate } from '../utils/formatters.js'

const STATUS_TABS = ['All', 'New', 'Reviewing', 'Pursuing', 'No Bid', 'Won', 'Lost']
const STATUSES = ['New', 'Reviewing', 'Pursuing', 'No Bid', 'Won', 'Lost']

export default function Watchlist() {
  const { watchlist, updateItem, removeFromWatchlist } = useWatchlist()
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const filtered = watchlist.filter((opp) => {
    const matchesTab = activeTab === 'All' || opp.status === activeTab
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      opp.title?.toLowerCase().includes(q) ||
      opp.agency?.toLowerCase().includes(q) ||
      opp.naics?.includes(q)
    return matchesTab && matchesSearch
  })

  const handleExport = () => exportOpportunitiesToCSV(filtered)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Watchlist</h1>
          <p className="text-sm text-gray-500">{watchlist.length} saved opportunities</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleExport} disabled={filtered.length === 0}>
          Export CSV
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap bg-white border border-gray-200 rounded-lg p-1">
        {STATUS_TABS.map((tab) => {
          const count = tab === 'All' ? watchlist.length : watchlist.filter((w) => w.status === tab).length
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab} {count > 0 && <span className="ml-0.5 opacity-80">({count})</span>}
            </button>
          )
        })}
      </div>

      {/* Search */}
      <Input
        placeholder="Search by title, agency, NAICS…"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No saved opportunities"
          description={watchlist.length === 0 ? 'Go to Opportunity Search to find and save opportunities.' : 'No items match your filter.'}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((opp) => {
            const isExpanded = expandedId === opp.id
            const isPastDue = opp.dueDate && new Date(opp.dueDate) < new Date()

            return (
              <div key={opp.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div
                  className="px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                >
                  {/* Priority star */}
                  <button
                    className={`flex-shrink-0 mt-0.5 text-lg ${opp.priority ? 'text-amber-400' : 'text-gray-200 hover:text-amber-300'}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      updateItem(opp.id, { priority: !opp.priority })
                    }}
                    title="Toggle priority"
                  >
                    ★
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{truncate(opp.title, 70)}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {opp.agency} · NAICS {opp.naics} · {opp.setAside}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge label={opp.status} />
                        <span className="text-xs text-gray-400">{formatCurrency(opp.estimatedValue)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                      <span>Saved: {formatDate(opp.savedAt)}</span>
                      {opp.dueDate && (
                        <span className={isPastDue ? 'text-red-600 font-medium' : ''}>
                          Due: {formatDate(opp.dueDate)} ({formatDaysUntil(opp.dueDate)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded edit area */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Select
                        label="Status"
                        value={opp.status || 'New'}
                        onChange={(e) => updateItem(opp.id, { status: e.target.value })}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </Select>
                      <Input
                        label="Reminder Date"
                        type="date"
                        value={opp.reminderDate || ''}
                        onChange={(e) => updateItem(opp.id, { reminderDate: e.target.value })}
                      />
                      <div className="flex items-end">
                        <a
                          href={opp.samUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          ↗ SAM.gov
                        </a>
                      </div>
                    </div>
                    <Textarea
                      label="Notes"
                      value={opp.notes || ''}
                      onChange={(e) => updateItem(opp.id, { notes: e.target.value })}
                      placeholder="Add notes, action items, contacts…"
                      rows={2}
                    />
                    <div className="flex justify-end">
                      <Button
                        variant="danger"
                        size="xs"
                        onClick={() => {
                          if (window.confirm('Remove from watchlist?')) {
                            removeFromWatchlist(opp.id)
                            if (expandedId === opp.id) setExpandedId(null)
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
