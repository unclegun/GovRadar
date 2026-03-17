import { useMemo, useState } from 'react'
import { searchOpportunities } from '../api/samApi'
import { DataSourceBadge } from '../components/ui/DataSourceBadge'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingState } from '../components/ui/LoadingState'
import { OpportunityDetailPanel } from '../components/search/OpportunityDetailPanel'
import { useBusinessProfile } from '../hooks/useBusinessProfile'
import { useSearchPresets } from '../hooks/useSearchPresets'
import { useWatchlist } from '../hooks/useWatchlist'
import { agencies, naicsCodes, setAsides } from '../data/referenceData'
import { scoreOpportunity } from '../utils/scoreOpportunity'
import { formatDate } from '../utils/formatters'

const defaultFilters = {
  keyword: '',
  agency: '',
  naics: '',
  setAside: '',
  postedAfter: '',
  minFitScore: 0,
}

export function OpportunitySearchPage() {
  const [filters, setFilters] = useState(defaultFilters)
  const [useMock, setUseMock] = useState(false)
  const [results, setResults] = useState([])
  const [sortBy, setSortBy] = useState({ key: 'fitScore', direction: 'desc' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [visibleCount, setVisibleCount] = useState(7)
  const [selectedId, setSelectedId] = useState('')
  const [presetName, setPresetName] = useState('')
  const [presetNotes, setPresetNotes] = useState('')

  const { profile } = useBusinessProfile()
  const { watchlist, saveOpportunity } = useWatchlist()
  const { presets, savePreset, deletePreset } = useSearchPresets()

  const savedIds = useMemo(() => new Set(watchlist.map((item) => item.id)), [watchlist])

  const scoredResults = useMemo(() => {
    return results
      .map((item) => {
        const score = scoreOpportunity(item, profile)
        return { ...item, fitScore: score.total, score }
      })
      .filter((item) => item.fitScore >= Number(filters.minFitScore || 0))
      .sort((a, b) => {
        const dir = sortBy.direction === 'asc' ? 1 : -1
        if (sortBy.key === 'title' || sortBy.key === 'agency') {
          return a[sortBy.key].localeCompare(b[sortBy.key]) * dir
        }
        return (a[sortBy.key] > b[sortBy.key] ? 1 : -1) * dir
      })
  }, [results, filters.minFitScore, sortBy, profile])

  const visibleResults = scoredResults.slice(0, visibleCount)
  const selectedOpportunity = scoredResults.find((item) => item.id === selectedId)

  const runSearch = async () => {
    setLoading(true)
    setError('')

    try {
      const payload = await searchOpportunities(filters, useMock)
      setResults(payload)
      setVisibleCount(7)
    } catch (err) {
      setError(
        `${err.message || 'Search failed.'} If live data is blocked in-browser, toggle to Mock Data.`,
      )
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const toggleSort = (key) => {
    setSortBy((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' }
      return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
    })
  }

  const handlePresetSave = () => {
    if (!presetName.trim()) return

    savePreset({
      name: presetName,
      notes: presetNotes,
      filters,
      createdAt: new Date().toISOString(),
    })

    setPresetName('')
    setPresetNotes('')
  }

  const applyPreset = (preset) => {
    setFilters(preset.filters)
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Opportunity Search</h1>
          <p className="text-sm text-slate-600">Find opportunities and score them against your business profile.</p>
        </div>
        <DataSourceBadge useMock={useMock} />
      </header>

      <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-3">
        <input
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="Keyword"
          value={filters.keyword}
          onChange={(event) => setFilters((prev) => ({ ...prev, keyword: event.target.value }))}
        />
        <select
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          value={filters.agency}
          onChange={(event) => setFilters((prev) => ({ ...prev, agency: event.target.value }))}
        >
          <option value="">All Agencies</option>
          {agencies.map((agency) => (
            <option key={agency} value={agency}>
              {agency}
            </option>
          ))}
        </select>
        <select
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          value={filters.naics}
          onChange={(event) => setFilters((prev) => ({ ...prev, naics: event.target.value }))}
        >
          <option value="">All NAICS</option>
          {naicsCodes.map((naics) => (
            <option key={naics} value={naics}>
              {naics}
            </option>
          ))}
        </select>
        <select
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          value={filters.setAside}
          onChange={(event) => setFilters((prev) => ({ ...prev, setAside: event.target.value }))}
        >
          <option value="">All Set-Asides</option>
          {setAsides.map((setAside) => (
            <option key={setAside} value={setAside}>
              {setAside}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          value={filters.postedAfter}
          onChange={(event) => setFilters((prev) => ({ ...prev, postedAfter: event.target.value }))}
        />
        <input
          type="number"
          min="0"
          max="100"
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          value={filters.minFitScore}
          onChange={(event) => setFilters((prev) => ({ ...prev, minFitScore: event.target.value }))}
          placeholder="Min fit score"
        />

        <div className="flex flex-wrap gap-2 md:col-span-3">
          <button
            type="button"
            onClick={runSearch}
            className="rounded bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setUseMock((prev) => !prev)}
            className="rounded border border-slate-300 px-4 py-2 text-sm"
          >
            Toggle to {useMock ? 'Live API' : 'Mock Data'}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-base font-semibold">Search Presets</h2>
        <div className="grid gap-2 md:grid-cols-3">
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="Preset name"
            value={presetName}
            onChange={(event) => setPresetName(event.target.value)}
          />
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="Notes"
            value={presetNotes}
            onChange={(event) => setPresetNotes(event.target.value)}
          />
          <button
            type="button"
            onClick={handlePresetSave}
            className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
          >
            Save Current Search as Preset
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {presets.map((preset) => (
            <div key={preset.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-200 p-3">
              <div>
                <p className="text-sm font-semibold">{preset.name}</p>
                {preset.notes && <p className="text-xs text-slate-600">{preset.notes}</p>}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => applyPreset(preset)} className="rounded border border-slate-300 px-3 py-1 text-xs">
                  Run Preset
                </button>
                <button type="button" onClick={() => deletePreset(preset.id)} className="rounded border border-red-300 px-3 py-1 text-xs text-red-700">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!presets.length && <p className="text-sm text-slate-600">No presets saved yet.</p>}
        </div>
      </section>

      {loading && <LoadingState text="Searching opportunities..." />}
      {error && <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {!loading && !error && !scoredResults.length && (
        <EmptyState
          title="No opportunities to display"
          message="Run a search or lower your filters to view matching opportunities."
        />
      )}

      {!!scoredResults.length && (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  {[
                    ['title', 'Title'],
                    ['agency', 'Agency'],
                    ['postedDate', 'Posted'],
                    ['dueDate', 'Due'],
                    ['naics', 'NAICS'],
                    ['setAside', 'Set-Aside'],
                    ['fitScore', 'Fit Score'],
                  ].map(([key, label]) => (
                    <th key={key} className="px-3 py-2 font-semibold">
                      <button type="button" onClick={() => toggleSort(key)}>
                        {label}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleResults.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2">
                      <button className="text-left text-brand-800 underline" onClick={() => setSelectedId(item.id)} type="button">
                        {item.title}
                      </button>
                    </td>
                    <td className="px-3 py-2">{item.agency}</td>
                    <td className="px-3 py-2">{formatDate(item.postedDate)}</td>
                    <td className="px-3 py-2">{formatDate(item.dueDate)}</td>
                    <td className="px-3 py-2">{item.naics}</td>
                    <td className="px-3 py-2">{item.setAside}</td>
                    <td className="px-3 py-2 font-semibold text-brand-800">{item.fitScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {visibleCount < scoredResults.length && (
            <div className="border-t border-slate-200 p-3">
              <button
                type="button"
                className="rounded border border-slate-300 px-3 py-2 text-sm"
                onClick={() => setVisibleCount((prev) => prev + 7)}
              >
                Load More
              </button>
            </div>
          )}
        </section>
      )}

      {selectedOpportunity && (
        <OpportunityDetailPanel
          opportunity={selectedOpportunity}
          score={selectedOpportunity.score}
          onSave={saveOpportunity}
          onClose={() => setSelectedId('')}
          isSaved={savedIds.has(selectedOpportunity.id)}
        />
      )}
    </div>
  )
}
