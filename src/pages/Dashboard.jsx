import { Link } from 'react-router-dom'
import { useWatchlist } from '../hooks/useWatchlist.js'
import { useSearchPresets } from '../hooks/useSearchPresets.js'
import { usePipeline } from '../hooks/usePipeline.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { STORAGE_KEYS } from '../utils/storage.js'
import StatCard from '../components/ui/StatCard.jsx'
import Badge from '../components/ui/Badge.jsx'
import { formatDate, formatCurrency, formatDaysUntil } from '../utils/formatters.js'

export default function Dashboard() {
  const { watchlist } = useWatchlist()
  const { presets } = useSearchPresets()
  const { columns } = usePipeline()
  const [savedPrimes] = useLocalStorage(STORAGE_KEYS.PRIMES, [])

  const pursued = watchlist.filter((w) => w.status === 'Pursuing' || w.status === 'Reviewing').length
  const totalCards = columns.reduce((sum, col) => sum + col.cards.length, 0)

  const recentSaved = [...watchlist]
    .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
    .slice(0, 5)

  const upcoming = watchlist
    .filter((w) => w.dueDate && new Date(w.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  // Top agencies from watchlist
  const agencyCounts = {}
  watchlist.forEach((w) => {
    if (w.agency) agencyCounts[w.agency] = (agencyCounts[w.agency] || 0) + 1
  })
  const topAgencies = Object.entries(agencyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Top NAICS
  const naicsCounts = {}
  watchlist.forEach((w) => {
    if (w.naics) naicsCounts[w.naics] = (naicsCounts[w.naics] || 0) + 1
  })
  const topNaics = Object.entries(naicsCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your government contracting overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Saved Opportunities"
          value={watchlist.length}
          subtitle="In your watchlist"
          accentColor="blue"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          }
        />
        <StatCard
          title="Pursuing"
          value={pursued}
          subtitle="Active pursuits"
          accentColor="indigo"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <StatCard
          title="Saved Primes"
          value={savedPrimes.length}
          subtitle="Teaming partners"
          accentColor="green"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          title="Search Presets"
          value={presets.length}
          subtitle="Saved searches"
          accentColor="amber"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Saved */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">Recently Saved</h2>
            <Link to="/watchlist" className="text-xs text-blue-600 hover:underline">View all →</Link>
          </div>
          {recentSaved.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-400">No saved opportunities yet.</p>
              <Link to="/search" className="mt-2 text-xs text-blue-600 hover:underline block">
                Search opportunities →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentSaved.map((opp) => (
                <div key={opp.id} className="px-5 py-3 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{opp.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{opp.agency}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge label={opp.status} />
                    <div className="text-xs text-gray-400 mt-1">{formatDate(opp.savedAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Due Dates */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">Upcoming Due Dates</h2>
          </div>
          {upcoming.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              No upcoming deadlines
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {upcoming.map((opp) => (
                <div key={opp.id} className="px-4 py-3">
                  <div className="text-xs font-medium text-gray-800 truncate">{opp.title}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{formatDate(opp.dueDate)}</span>
                    <span className="text-xs text-amber-600 font-medium">{formatDaysUntil(opp.dueDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { to: '/search', label: '🔍 Search Opportunities' },
              { to: '/pipeline', label: '📋 View Pipeline' },
              { to: '/agencies', label: '🏛 Agency Intelligence' },
              { to: '/capability', label: '📄 Capability Statement' },
              { to: '/settings', label: '⚙ Update Business Profile' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Top Agencies */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Top Agencies (Watchlist)</h2>
          {topAgencies.length === 0 ? (
            <p className="text-sm text-gray-400">Save opportunities to see agency trends.</p>
          ) : (
            <div className="space-y-2">
              {topAgencies.map(([agency, count]) => (
                <div key={agency} className="flex items-center justify-between">
                  <span className="text-xs text-gray-700 truncate flex-1">{agency}</span>
                  <span className="text-xs font-bold text-blue-700 ml-2">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top NAICS */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Top NAICS (Watchlist)</h2>
          {topNaics.length === 0 ? (
            <p className="text-sm text-gray-400">Save opportunities to see NAICS trends.</p>
          ) : (
            <div className="space-y-2">
              {topNaics.map(([naics, count]) => (
                <div key={naics} className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-700">{naics}</span>
                  <span className="text-xs font-bold text-indigo-700 ml-2">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pipeline summary */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Pipeline Overview</h2>
          <Link to="/pipeline" className="text-xs text-blue-600 hover:underline">Open Pipeline →</Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 divide-x divide-gray-100">
          {columns.map((col) => (
            <div key={col.id} className="px-4 py-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{col.cards.length}</div>
              <div className="text-xs text-gray-500 mt-0.5">{col.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
