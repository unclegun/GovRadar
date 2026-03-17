import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { StatCard } from '../components/ui/StatCard'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useWatchlist } from '../hooks/useWatchlist'
import { useSearchPresets } from '../hooks/useSearchPresets'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { formatDate, daysUntil } from '../utils/formatters'

function topBy(items, field) {
  const counts = items.reduce((acc, item) => {
    const key = item[field] || 'N/A'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
}

export function DashboardPage() {
  const { watchlist } = useWatchlist()
  const { presets } = useSearchPresets()
  const [savedPrimes] = useLocalStorage(STORAGE_KEYS.savedPrimes, [])

  const pursuedCount = watchlist.filter((item) => item.status === 'Pursue').length
  const avgFitScore = watchlist.length
    ? Math.round(
        watchlist.reduce((sum, item) => sum + Number(item.fitScore || 0), 0) /
          watchlist.length,
      )
    : 0
  const recent = watchlist.slice(0, 5)
  const upcoming = [...watchlist]
    .filter((item) => item.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 6)
  const topAgencies = topBy(watchlist, 'agency')
  const topNaics = topBy(watchlist, 'naics')

  return (
    <div className="space-y-5">
      <header className="rounded-xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Daily view of your contracting activity, opportunity mix, and deadlines.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Saved Opportunities" value={watchlist.length} detail={`Avg fit ${avgFitScore}`} />
        <StatCard label="Pursued Opportunities" value={pursuedCount} />
        <StatCard label="Saved Primes" value={savedPrimes.length} />
        <StatCard label="Search Presets" value={presets.length} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card title="Recent Saved Opportunities">
          {!recent.length && <p className="text-sm text-slate-600">No opportunities saved yet.</p>}
          <ul className="space-y-2">
            {recent.map((item) => (
              <li key={item.id} className="rounded border border-slate-100 p-2 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-slate-600">{item.agency}</p>
                  </div>
                  <span className="rounded bg-brand-100 px-2 py-1 text-xs font-semibold text-brand-800">
                    Fit {item.fitScore ?? 'N/A'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Upcoming Due Dates">
          {!upcoming.length && <p className="text-sm text-slate-600">No due dates on the radar.</p>}
          <ul className="space-y-2">
            {upcoming.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded border border-slate-100 p-2 text-sm">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-slate-600">{formatDate(item.dueDate)}</p>
                </div>
                <span className="font-semibold text-brand-800">{daysUntil(item.dueDate)}d</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card title="Top Agencies from Saved Items">
          {!topAgencies.length && <p className="text-sm text-slate-600">No agency trends yet.</p>}
          <ul className="space-y-1 text-sm">
            {topAgencies.map(([name, count]) => (
              <li key={name} className="flex justify-between rounded border border-slate-100 p-2">
                <span>{name}</span>
                <span className="font-semibold">{count}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Top NAICS from Saved Items">
          {!topNaics.length && <p className="text-sm text-slate-600">No NAICS trends yet.</p>}
          <ul className="space-y-1 text-sm">
            {topNaics.map(([name, count]) => (
              <li key={name} className="flex justify-between rounded border border-slate-100 p-2">
                <span>{name}</span>
                <span className="font-semibold">{count}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-2 text-sm">
            <Link className="block rounded border border-slate-200 p-2 hover:bg-slate-50" to="/search">
              Run Opportunity Search
            </Link>
            <Link className="block rounded border border-slate-200 p-2 hover:bg-slate-50" to="/pipeline">
              Open Pipeline Board
            </Link>
            <Link className="block rounded border border-slate-200 p-2 hover:bg-slate-50" to="/prime-finder">
              Review Prime Candidates
            </Link>
            <Link className="block rounded border border-slate-200 p-2 hover:bg-slate-50" to="/capability-builder">
              Update Capability Statement
            </Link>
          </div>
        </Card>
      </section>
    </div>
  )
}
