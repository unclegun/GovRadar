import { useMemo, useState } from 'react'
import { searchOpportunities } from '../api/samApi'
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
  agencies: [],
  naics: '',
  setAside: '',
  postedAfter: '',
  minFitScore: 0,
}

function normalizeFilters(value = {}) {
  const agencies = Array.isArray(value.agencies)
    ? value.agencies
    : value.agency
      ? [value.agency]
      : []

  return {
    ...defaultFilters,
    ...value,
    agencies,
  }
}

export function OpportunitySearchPage() {
  const [filters, setFilters] = useState(defaultFilters)
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
      const payload = await searchOpportunities(filters)
      setResults(payload)
      setVisibleCount(7)
    } catch (err) {
      setError(
        `${err.message || 'Search failed.'} Live browser access may be blocked by network or CORS policy.`,
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
    setFilters(normalizeFilters(preset.filters))
  }

  return (
    <div className="space-y-5">
      <header className="page-header flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-title">Opportunity Search</h1>
          <p className="page-subtitle">Find opportunities and score them against your business profile.</p>
        </div>
      </header>

      <section className="panel-modern grid items-start gap-3 p-4 md:grid-cols-3">
        <label className="block">
          <span className="field-label">Keyword</span>
          <input
            className="input-modern"
            placeholder="Keyword"
            value={filters.keyword}
            onChange={(event) => setFilters((prev) => ({ ...prev, keyword: event.target.value }))}
          />
        </label>
        <div className="space-y-1">
          <p className="field-label">Agencies</p>
          <select
            className="input-modern h-28"
            multiple
            value={filters.agencies}
            onChange={(event) => {
              const selected = Array.from(event.target.selectedOptions, (option) => option.value)
              setFilters((prev) => ({ ...prev, agencies: selected }))
            }}
          >
            {agencies.map((agency) => (
              <option key={agency} value={agency}>
                {agency}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500">Select one or more agencies (Ctrl/Cmd + click for multi-select).</p>
        </div>
        <label className="block">
          <span className="field-label">NAICS</span>
          <select
            className="input-modern"
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
        </label>
        <label className="block">
          <span className="field-label">Set-Aside</span>
          <select
            className="input-modern"
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
        </label>
        <label className="block">
          <span className="field-label">Posted After</span>
          <input
            type="date"
            className="input-modern"
            value={filters.postedAfter}
            onChange={(event) => setFilters((prev) => ({ ...prev, postedAfter: event.target.value }))}
          />
        </label>
        <label className="block">
          <span className="field-label">Minimum Fit Score</span>
          <input
            type="number"
            min="0"
            max="100"
            className="input-modern"
            value={filters.minFitScore}
            onChange={(event) => setFilters((prev) => ({ ...prev, minFitScore: event.target.value }))}
            placeholder="Min fit score"
          />
        </label>

        <div className="action-wrap md:col-span-3">
          <button
            type="button"
            onClick={runSearch}
            className="btn-primary w-full sm:w-auto"
          >
            Search
          </button>
        </div>
      </section>

      <section className="panel-modern rounded-2xl border border-slate-200/80 p-4">
        <h2 className="mb-3 text-base font-semibold">Search Presets</h2>
        <div className="grid gap-2 md:grid-cols-3">
          <input
            className="input-modern"
            placeholder="Preset name"
            value={presetName}
            onChange={(event) => setPresetName(event.target.value)}
          />
          <input
            className="input-modern"
            placeholder="Notes"
            value={presetNotes}
            onChange={(event) => setPresetNotes(event.target.value)}
          />
          <button
            type="button"
            onClick={handlePresetSave}
            className="btn-secondary w-full sm:w-auto"
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
            <table className="table-modern">
              <thead>
                <tr>
                  {[
                    ['title', 'Title'],
                    ['agency', 'Agency'],
                    ['postedDate', 'Posted'],
                    ['dueDate', 'Due'],
                    ['naics', 'NAICS'],
                    ['setAside', 'Set-Aside'],
                    ['fitScore', 'Fit Score (/100)'],
                  ].map(([key, label]) => (
                    <th key={key}>
                      <button type="button" onClick={() => toggleSort(key)}>
                        {label}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleResults.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td>
                      <button className="text-left text-brand-800 underline" onClick={() => setSelectedId(item.id)} type="button">
                        {item.title}
                      </button>
                    </td>
                    <td>{item.agency}</td>
                    <td>{formatDate(item.postedDate)}</td>
                    <td>{formatDate(item.dueDate)}</td>
                    <td>{item.naics}</td>
                    <td>{item.setAside}</td>
                    <td>
                      <span className="fit-pill">Fit Score: {item.fitScore}/100</span>
                    </td>
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
