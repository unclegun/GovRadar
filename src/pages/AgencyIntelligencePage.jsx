import { useMemo, useState } from 'react'
import { getAwardsData } from '../api/spendingApi'
import { DataSourceBadge } from '../components/ui/DataSourceBadge'
import { Card } from '../components/ui/Card'
import { LoadingState } from '../components/ui/LoadingState'
import { EmptyState } from '../components/ui/EmptyState'
import { agencies } from '../data/referenceData'
import { useLocalStorage } from '../hooks/useLocalStorage'

export function AgencyIntelligencePage() {
  const [keyword, setKeyword] = useState('')
  const [agency, setAgency] = useState('')
  const [useMock, setUseMock] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [insight, setInsight] = useState(null)
  const [snapshots, setSnapshots] = useLocalStorage('ss_intel_snapshots', [])

  const totalAwards = useMemo(() => insight?.rows.length || 0, [insight])

  const run = async () => {
    setLoading(true)
    setError('')
    try {
      const payload = await getAwardsData({ keyword, agency }, useMock)
      setInsight(payload)
    } catch (err) {
      setError(
        `${err.message || 'Unable to load intelligence data.'} If blocked in-browser, switch to Mock mode.`,
      )
      setInsight(null)
    } finally {
      setLoading(false)
    }
  }

  const saveSnapshot = () => {
    if (!insight) return

    setSnapshots((prev) => [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        keyword,
        agency,
        summary: {
          topAgencies: insight.topAgencies,
          topVendors: insight.topVendors,
          commonNaics: insight.commonNaics,
          totalAwards: insight.rows.length,
        },
      },
      ...prev,
    ])
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Agency Intelligence</h1>
          <p className="text-sm text-slate-600">Analyze agency buying patterns and vendor concentration.</p>
        </div>
        <DataSourceBadge useMock={useMock} />
      </header>

      <Card>
        <div className="grid gap-2 md:grid-cols-4">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            placeholder="Keyword (e.g., dashboard, cloud, PMO)"
          />
          <select
            value={agency}
            onChange={(event) => setAgency(event.target.value)}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All Agencies</option>
            {agencies.map((agencyName) => (
              <option key={agencyName} value={agencyName}>
                {agencyName}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button type="button" onClick={run} className="rounded bg-brand-800 px-4 py-2 text-sm font-semibold text-white">
              Analyze
            </button>
            <button type="button" onClick={() => setUseMock((prev) => !prev)} className="rounded border border-slate-300 px-3 py-2 text-sm">
              {useMock ? 'Try Live' : 'Use Mock'}
            </button>
          </div>
        </div>
      </Card>

      {loading && <LoadingState text="Running spending analysis..." />}
      {error && <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {!loading && !error && !insight && (
        <EmptyState title="No intelligence yet" message="Run a query to view agency and vendor summaries." />
      )}

      {insight && (
        <>
          <section className="grid gap-3 md:grid-cols-4">
            <Card title="Awards in Result Set">{totalAwards}</Card>
            <Card title="Top Agency">{insight.topAgencies[0]?.label || 'N/A'}</Card>
            <Card title="Top Vendor">{insight.topVendors[0]?.label || 'N/A'}</Card>
            <Card title="Top NAICS">{insight.commonNaics[0]?.label || 'N/A'}</Card>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Card title="Top Agencies">
              <ul className="space-y-2 text-sm">
                {insight.topAgencies.map((item) => (
                  <li key={item.label} className="grid grid-cols-[1fr_auto] gap-2">
                    <span>{item.label}</span>
                    <span className="font-semibold">{item.count}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Top Vendors">
              <ul className="space-y-2 text-sm">
                {insight.topVendors.map((item) => (
                  <li key={item.label} className="grid grid-cols-[1fr_auto] gap-2">
                    <span>{item.label}</span>
                    <span className="font-semibold">{item.count}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          <Card
            title="Trend Snapshot"
            actions={
              <button type="button" onClick={saveSnapshot} className="rounded border border-slate-300 px-3 py-1 text-xs">
                Save Snapshot
              </button>
            }
          >
            <div className="flex items-end gap-2">
              {insight.recentAwardCounts.map((point, index) => (
                <div key={`${point.period}-${index}`} className="flex flex-col items-center gap-2">
                  <div className="w-6 rounded-t bg-brand-700" style={{ height: `${30 + point.awards * 18}px` }}></div>
                  <span className="text-[11px] text-slate-600">{point.period.slice(5)}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Award Summary Rows">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-3 py-2">Agency</th>
                    <th className="px-3 py-2">Vendor</th>
                    <th className="px-3 py-2">NAICS</th>
                    <th className="px-3 py-2">Award Date</th>
                    <th className="px-3 py-2">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {insight.rows.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="px-3 py-2">{row.agency}</td>
                      <td className="px-3 py-2">{row.vendor}</td>
                      <td className="px-3 py-2">{row.naics}</td>
                      <td className="px-3 py-2">{row.awardDate}</td>
                      <td className="px-3 py-2">
                        <a
                          href={row.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-800 underline"
                        >
                          USAspending
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Saved Snapshots" subtitle="Locally stored intelligence snapshots">
            {!snapshots.length && <p className="text-sm text-slate-600">No snapshots saved yet.</p>}
            <ul className="space-y-2 text-sm">
              {snapshots.map((snapshot) => (
                <li key={snapshot.id} className="rounded border border-slate-100 p-2">
                  <p className="font-semibold">{new Date(snapshot.createdAt).toLocaleString()}</p>
                  <p className="text-slate-600">
                    {snapshot.agency || 'All Agencies'} | {snapshot.keyword || 'No Keyword'} | {snapshot.summary.totalAwards} awards
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </div>
  )
}
