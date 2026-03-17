import { useMemo, useState } from 'react'
import { getAwardsData, summarizePrimes } from '../api/spendingApi'
import { Card } from '../components/ui/Card'
import { DataSourceBadge } from '../components/ui/DataSourceBadge'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingState } from '../components/ui/LoadingState'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { agencies, naicsCodes } from '../data/referenceData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { exportToCsv } from '../utils/exportUtils'

export function PrimeFinderPage() {
  const [filters, setFilters] = useState({ agency: '', keyword: '', naics: '' })
  const [useMock, setUseMock] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedPrimes, setSavedPrimes] = useLocalStorage(STORAGE_KEYS.savedPrimes, [])

  const run = async () => {
    setLoading(true)
    setError('')
    try {
      const payload = await getAwardsData(
        { keyword: filters.keyword, agency: filters.agency },
        useMock,
      )

      const summarized = summarizePrimes(payload.rows).filter((item) => {
        const matchesNaics = !filters.naics || item.commonNaics.includes(filters.naics)
        return matchesNaics
      })

      setResults(summarized)
    } catch (err) {
      setError(`${err.message || 'Prime lookup failed.'} If blocked in-browser, switch to Mock mode.`)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const savePrime = (prime) => {
    setSavedPrimes((prev) => {
      if (prev.find((item) => item.companyName === prime.companyName)) return prev
      return [{ ...prime, notes: '' }, ...prev]
    })
  }

  const updatePrimeNotes = (companyName, notes) => {
    setSavedPrimes((prev) =>
      prev.map((item) => (item.companyName === companyName ? { ...item, notes } : item)),
    )
  }

  const exportRows = useMemo(
    () =>
      savedPrimes.map((prime) => ({
        companyName: prime.companyName,
        recentAwardCount: prime.recentAwardCount,
        agenciesWorkedWith: prime.agenciesWorkedWith,
        commonNaics: prime.commonNaics,
        notes: prime.notes,
      })),
    [savedPrimes],
  )

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Prime Finder</h1>
          <p className="text-sm text-slate-600">Identify likely prime contractors based on historical awards.</p>
        </div>
        <DataSourceBadge useMock={useMock} />
      </header>

      <Card>
        <div className="grid gap-2 md:grid-cols-4">
          <select
            value={filters.agency}
            onChange={(event) => setFilters((prev) => ({ ...prev, agency: event.target.value }))}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All Agencies</option>
            {agencies.map((agency) => (
              <option key={agency} value={agency}>
                {agency}
              </option>
            ))}
          </select>
          <input
            value={filters.keyword}
            onChange={(event) => setFilters((prev) => ({ ...prev, keyword: event.target.value }))}
            placeholder="Keyword"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={filters.naics}
            onChange={(event) => setFilters((prev) => ({ ...prev, naics: event.target.value }))}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All NAICS</option>
            {naicsCodes.map((naics) => (
              <option key={naics} value={naics}>
                {naics}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button onClick={run} type="button" className="rounded bg-brand-800 px-4 py-2 text-sm font-semibold text-white">
              Find Primes
            </button>
            <button
              type="button"
              onClick={() => setUseMock((prev) => !prev)}
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            >
              {useMock ? 'Try Live' : 'Use Mock'}
            </button>
          </div>
        </div>
      </Card>

      {loading && <LoadingState text="Compiling prime candidates..." />}
      {error && <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {!loading && !error && !results.length && (
        <EmptyState title="No prime results" message="Run the finder with agency or NAICS filters." />
      )}

      {!!results.length && (
        <Card title="Candidate Primes">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-3 py-2">Company</th>
                  <th className="px-3 py-2">Recent Awards</th>
                  <th className="px-3 py-2">Agencies</th>
                  <th className="px-3 py-2">Common NAICS</th>
                  <th className="px-3 py-2">Source</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row) => (
                  <tr key={row.companyName} className="border-t border-slate-100">
                    <td className="px-3 py-2">{row.companyName}</td>
                    <td className="px-3 py-2">{row.recentAwardCount}</td>
                    <td className="px-3 py-2">{row.agenciesWorkedWith}</td>
                    <td className="px-3 py-2">{row.commonNaics}</td>
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
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => savePrime(row)}
                        className="rounded border border-slate-300 px-3 py-1 text-xs"
                      >
                        Save Prime
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card
        title="Saved Primes"
        actions={
          <button
            type="button"
            onClick={() => exportToCsv('saved-primes.csv', exportRows)}
            className="rounded bg-slate-800 px-3 py-1 text-xs font-semibold text-white"
          >
            Export CSV
          </button>
        }
      >
        {!savedPrimes.length && <p className="text-sm text-slate-600">No primes saved yet.</p>}
        <div className="space-y-3">
          {savedPrimes.map((prime) => (
            <div key={prime.companyName} className="rounded border border-slate-100 p-3">
              <p className="font-semibold">{prime.companyName}</p>
              <p className="text-sm text-slate-600">
                {prime.recentAwardCount} awards | {prime.agenciesWorkedWith}
              </p>
              <textarea
                className="mt-2 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                rows={2}
                value={prime.notes || ''}
                onChange={(event) => updatePrimeNotes(prime.companyName, event.target.value)}
                placeholder="Capture outreach timing, BD owner, and subcontracting angle."
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
