import { useMemo, useState } from 'react'
import { EmptyState } from '../components/ui/EmptyState'
import { Card } from '../components/ui/Card'
import { useWatchlist } from '../hooks/useWatchlist'
import { exportToCsv } from '../utils/exportUtils'
import { formatDate } from '../utils/formatters'

const statuses = ['All', 'New', 'Researching', 'Pursue', 'Pass', 'Partnering']

export function WatchlistPage() {
  const { watchlist, updateItem, removeItem } = useWatchlist()
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchText, setSearchText] = useState('')

  const filtered = useMemo(() => {
    const text = searchText.toLowerCase()
    return watchlist.filter((item) => {
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter
      const matchesText =
        !text ||
        item.title.toLowerCase().includes(text) ||
        item.agency.toLowerCase().includes(text) ||
        item.notes.toLowerCase().includes(text)
      return matchesStatus && matchesText
    })
  }, [watchlist, statusFilter, searchText])

  const exportRows = filtered.map((item) => ({
    title: item.title,
    agency: item.agency,
    dueDate: item.dueDate,
    naics: item.naics,
    setAside: item.setAside,
    status: item.status,
    priority: item.priority ? 'Yes' : 'No',
    reminderDate: item.reminderDate,
    notes: item.notes,
  }))

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Watchlist</h1>
        <p className="text-sm text-slate-600">Manage saved opportunities and pursuit decisions.</p>
      </header>

      <Card>
        <div className="grid gap-2 md:grid-cols-4">
          <select
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            placeholder="Search saved opportunities"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          <button
            type="button"
            onClick={() => exportToCsv('watchlist.csv', exportRows)}
            className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
          >
            Export CSV
          </button>
        </div>
      </Card>

      {!filtered.length && (
        <EmptyState
          title="No watchlist entries"
          message="Save opportunities from search results to start managing your pipeline."
        />
      )}

      {!!filtered.length && (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card key={item.id} title={item.title} subtitle={`${item.agency} | Due ${formatDate(item.dueDate)}`}>
              <p className="mb-3 text-sm font-semibold text-brand-800">Fit Score: {item.fitScore ?? 'N/A'}</p>
              <div className="grid gap-3 md:grid-cols-4">
                <select
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                  value={item.status}
                  onChange={(event) => updateItem(item.id, { status: event.target.value })}
                >
                  {statuses.slice(1).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.priority}
                    onChange={(event) => updateItem(item.id, { priority: event.target.checked })}
                  />
                  Priority
                </label>

                <input
                  type="date"
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                  value={item.reminderDate || ''}
                  onChange={(event) => updateItem(item.id, { reminderDate: event.target.value })}
                />

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="rounded border border-red-300 px-3 py-2 text-sm text-red-700"
                >
                  Remove
                </button>
              </div>
              <textarea
                className="mt-3 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                rows={3}
                value={item.notes}
                onChange={(event) => updateItem(item.id, { notes: event.target.value })}
                placeholder="Capture outreach plan, teaming notes, win themes, and risks."
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
