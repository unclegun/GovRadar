import { useState } from 'react'
import { getAgencySummary, isMockMode } from '../api/spendingApi.js'
import { mockAwards } from '../data/mockAwards.js'
import DataSourceBadge from '../components/ui/DataSourceBadge.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { formatCurrency, formatDate } from '../utils/formatters.js'

export default function AgencyIntelligence() {
  const [keyword, setKeyword] = useState('')
  const [agencies, setAgencies] = useState([])
  const [awards, setAwards] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    try {
      const results = await getAgencySummary(keyword)
      setAgencies(results)

      const filteredAwards = keyword
        ? mockAwards.filter(
            (a) =>
              a.agency.toLowerCase().includes(keyword.toLowerCase()) ||
              a.title.toLowerCase().includes(keyword.toLowerCase()) ||
              a.vendor.toLowerCase().includes(keyword.toLowerCase())
          )
        : mockAwards
      setAwards(filteredAwards)
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  const maxBudget = agencies.length > 0 ? Math.max(...agencies.map((a) => a.budget)) : 1

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agency Intelligence</h1>
          <p className="text-sm text-gray-500">Research agency budgets, awards, and spending patterns</p>
        </div>
        <DataSourceBadge isMock={isMockMode} />
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex gap-3">
        <Input
          placeholder="Search by agency name or keyword…"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Loading…' : 'Search'}
        </Button>
        <Button variant="secondary" onClick={() => { setKeyword(''); setAgencies([]); setAwards([]); setSearched(false) }}>
          Clear
        </Button>
      </div>

      {!searched && !loading && (
        <EmptyState
          icon="🏛"
          title="Search agencies"
          description="Enter a keyword or agency name to explore budgets and recent awards."
        />
      )}

      {searched && agencies.length === 0 && (
        <EmptyState icon="🔍" title="No agencies found" description="Try a different keyword." />
      )}

      {agencies.length > 0 && (
        <>
          {/* Agency stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agencies.slice(0, 6).map((a) => (
              <StatCard
                key={a.id}
                title={a.shortName}
                value={formatCurrency(a.budget)}
                subtitle={`${a.recentAwardCount.toLocaleString()} recent awards`}
                accentColor="blue"
              />
            ))}
          </div>

          {/* Budget bar chart */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Annual IT Budget Comparison</h2>
            <div className="space-y-3">
              {agencies.map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <div className="w-24 text-xs font-medium text-gray-700 text-right flex-shrink-0">{a.shortName}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-5 bg-blue-500 rounded-full flex items-center pl-2"
                      style={{ width: `${(a.budget / maxBudget) * 100}%`, minWidth: '2%' }}
                    >
                      <span className="text-xs text-white font-medium whitespace-nowrap">
                        {formatCurrency(a.budget)}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 w-20 text-right flex-shrink-0">
                    {a.recentAwardCount.toLocaleString()} awards
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agency detail cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {agencies.map((a) => (
              <div key={a.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-bold text-gray-900">{a.name}</div>
                    <div className="text-xs text-gray-500">{a.shortName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-blue-700">{formatCurrency(a.budget)}</div>
                    <div className="text-xs text-gray-400">annual IT budget</div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{a.description}</p>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Top NAICS:</div>
                  <div className="flex gap-1 flex-wrap">
                    {a.topNaics.map((n) => (
                      <span key={n} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded font-mono">{n}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Awards table */}
      {awards.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-5 py-3.5 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">Recent Awards ({awards.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['Title', 'Vendor', 'Agency', 'Award Date', 'Amount', 'Duration'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {awards.map((award) => (
                  <tr key={award.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{award.title}</div>
                      <div className="text-xs text-gray-500">{award.contractNumber}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{award.vendor}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{award.agency}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{formatDate(award.awardDate)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-blue-700 whitespace-nowrap">{formatCurrency(award.awardAmount)}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{award.performancePeriod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
