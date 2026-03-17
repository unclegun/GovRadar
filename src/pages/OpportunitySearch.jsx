import { useState, useCallback } from 'react'
import { searchOpportunities, isMockMode } from '../api/samApi.js'
import { useBusinessProfile } from '../hooks/useBusinessProfile.js'
import { useWatchlist } from '../hooks/useWatchlist.js'
import { usePipeline } from '../hooks/usePipeline.js'
import { useSearchPresets } from '../hooks/useSearchPresets.js'
import OpportunityTable from '../components/opportunities/OpportunityTable.jsx'
import OpportunityFilters from '../components/opportunities/OpportunityFilters.jsx'
import OpportunityDrawer from '../components/opportunities/OpportunityDrawer.jsx'
import DataSourceBadge from '../components/ui/DataSourceBadge.jsx'
import Button from '../components/ui/Button.jsx'
import Modal from '../components/ui/Modal.jsx'
import Input from '../components/ui/Input.jsx'
import Textarea from '../components/ui/Textarea.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

export default function OpportunitySearch() {
  const [profile] = useBusinessProfile()
  const { addToWatchlist, isWatched } = useWatchlist()
  const { addCard } = usePipeline()
  const { presets, savePreset, deletePreset, runPreset } = useSearchPresets()

  const [filters, setFilters] = useState({ keyword: '', agency: '', naics: '', setAside: '', postedAfter: '' })
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState(null)
  const [selectedOpp, setSelectedOpp] = useState(null)
  const [showPresetModal, setShowPresetModal] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [presetNotes, setPresetNotes] = useState('')
  const [showPresetsPanel, setShowPresetsPanel] = useState(false)

  const doSearch = useCallback(async (searchFilters, pageNum = 1) => {
    setLoading(true)
    setError(null)
    try {
      const res = await searchOpportunities({ ...searchFilters, page: pageNum })
      if (pageNum === 1) {
        setResults(res.results)
      } else {
        setResults((prev) => [...prev, ...res.results])
      }
      setTotal(res.total)
      setHasMore(res.hasMore)
      setPage(pageNum)
      setSearched(true)
    } catch (err) {
      setError('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = () => doSearch(filters, 1)

  const handleLoadMore = () => doSearch(filters, page + 1)

  const handleSaveToWatchlist = (opp) => {
    addToWatchlist(opp)
  }

  const handleAddToPipeline = (opp) => {
    addCard({ ...opp }, 'discovered')
    alert('Added to Pipeline → Discovered column')
  }

  const handleSavePreset = () => {
    savePreset({ name: presetName, keyword: filters.keyword, filters, notes: presetNotes })
    setShowPresetModal(false)
    setPresetName('')
    setPresetNotes('')
  }

  const handleRunPreset = (preset) => {
    const params = runPreset(preset)
    setFilters({ keyword: params.keyword || '', agency: params.agency || '', naics: params.naics || '', setAside: params.setAside || '', postedAfter: params.postedAfter || '' })
    doSearch(params, 1)
    setShowPresetsPanel(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Opportunity Search</h1>
          <p className="text-sm text-gray-500">Search SAM.gov contract opportunities</p>
        </div>
        <div className="flex items-center gap-2">
          <DataSourceBadge isMock={isMockMode} />
          <Button variant="secondary" size="sm" onClick={() => setShowPresetsPanel(true)}>
            Presets ({presets.length})
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowPresetModal(true)}>
            + Save Preset
          </Button>
        </div>
      </div>

      <OpportunityFilters
        filters={filters}
        onChange={setFilters}
        onSearch={handleSearch}
        loading={loading}
      />

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {searched && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {total === 0 ? 'No results' : `${total} result${total === 1 ? '' : 's'}`}
            {loading && ' · Loading…'}
          </span>
        </div>
      )}

      {results.length > 0 && (
        <OpportunityTable
          opportunities={results}
          profile={profile}
          onRowClick={setSelectedOpp}
        />
      )}

      {searched && results.length === 0 && !loading && (
        <EmptyState
          icon="🔍"
          title="No opportunities found"
          description="Try adjusting your keywords or filters."
        />
      )}

      {!searched && !loading && (
        <EmptyState
          icon="📋"
          title="Search for opportunities"
          description="Use the filters above to find contract opportunities matching your profile."
        />
      )}

      {hasMore && (
        <div className="text-center">
          <Button variant="secondary" onClick={handleLoadMore} disabled={loading}>
            {loading ? 'Loading…' : 'Load More'}
          </Button>
        </div>
      )}

      {selectedOpp && (
        <OpportunityDrawer
          opportunity={selectedOpp}
          profile={profile}
          onClose={() => setSelectedOpp(null)}
          onSave={handleSaveToWatchlist}
          onAddToPipeline={handleAddToPipeline}
          isWatched={isWatched(selectedOpp.id)}
        />
      )}

      {/* Save Preset Modal */}
      <Modal isOpen={showPresetModal} onClose={() => setShowPresetModal(false)} title="Save Search Preset">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Save your current search filters as a preset for quick reuse.</p>
          <Input
            label="Preset Name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="e.g. DoD Cloud Opps"
          />
          <Textarea
            label="Notes (optional)"
            value={presetNotes}
            onChange={(e) => setPresetNotes(e.target.value)}
            placeholder="Description or context for this preset"
            rows={2}
          />
          <div className="bg-gray-50 rounded p-3 text-xs text-gray-600">
            <strong>Filters to save:</strong> keyword="{filters.keyword}", agency="{filters.agency}", naics="{filters.naics}", setAside="{filters.setAside}"
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" size="sm" onClick={() => setShowPresetModal(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSavePreset} disabled={!presetName}>Save Preset</Button>
          </div>
        </div>
      </Modal>

      {/* Presets Panel */}
      <Modal isOpen={showPresetsPanel} onClose={() => setShowPresetsPanel(false)} title="Saved Search Presets" size="lg">
        {presets.length === 0 ? (
          <EmptyState icon="🔖" title="No presets saved" description="Save a search preset to quickly rerun frequent searches." />
        ) : (
          <div className="space-y-2">
            {presets.map((preset) => (
              <div key={preset.id} className="flex items-start justify-between gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900">{preset.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    keyword: "{preset.keyword}" · agency: "{preset.filters?.agency || ''}" · setAside: "{preset.filters?.setAside || ''}"
                  </div>
                  {preset.notes && <div className="text-xs text-gray-400 italic mt-0.5">{preset.notes}</div>}
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <Button size="xs" onClick={() => handleRunPreset(preset)}>Run</Button>
                  <Button size="xs" variant="danger" onClick={() => deletePreset(preset.id)}>×</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
