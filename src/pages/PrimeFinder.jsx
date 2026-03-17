import { useState, useEffect } from 'react'
import { getVendorsByAgency, isMockMode } from '../api/spendingApi.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { STORAGE_KEYS } from '../utils/storage.js'
import { exportPrimesToCSV } from '../utils/csvExport.js'
import DataSourceBadge from '../components/ui/DataSourceBadge.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Select from '../components/ui/Select.jsx'
import Textarea from '../components/ui/Textarea.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { formatCurrency } from '../utils/formatters.js'

const VENDOR_TYPES = ['', 'Large Business', 'Small Business', '8(a)']

export default function PrimeFinder() {
  const [savedPrimes, setSavedPrimes] = useLocalStorage(STORAGE_KEYS.PRIMES, [])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [agencyFilter, setAgencyFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [keywordFilter, setKeywordFilter] = useState('')
  const [editNotesId, setEditNotesId] = useState(null)
  const [editNotesValue, setEditNotesValue] = useState('')

  const handleSearch = async () => {
    setLoading(true)
    try {
      const results = await getVendorsByAgency(agencyFilter)
      setVendors(results)
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleSearch()
  }, [])

  const filtered = vendors.filter((v) => {
    const matchType = !typeFilter || v.type === typeFilter
    const matchKw = !keywordFilter || v.name.toLowerCase().includes(keywordFilter.toLowerCase()) || v.specialties.some((s) => s.toLowerCase().includes(keywordFilter.toLowerCase()))
    return matchType && matchKw
  })

  const isSaved = (id) => savedPrimes.some((p) => p.id === id)

  const savePrime = (vendor) => {
    if (!isSaved(vendor.id)) {
      setSavedPrimes((prev) => [...prev, { ...vendor, savedAt: new Date().toISOString() }])
    }
  }

  const removePrime = (id) => {
    setSavedPrimes((prev) => prev.filter((p) => p.id !== id))
  }

  const updateNotes = (id, notes) => {
    setSavedPrimes((prev) => prev.map((p) => p.id === id ? { ...p, notes } : p))
    setEditNotesId(null)
  }

  const handleExport = () => exportPrimesToCSV(savedPrimes)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Prime Finder</h1>
          <p className="text-sm text-gray-500">Find teaming and subcontracting partners</p>
        </div>
        <div className="flex items-center gap-2">
          <DataSourceBadge isMock={isMockMode} />
          <Button variant="secondary" size="sm" onClick={handleExport} disabled={savedPrimes.length === 0}>
            Export Saved ({savedPrimes.length})
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <Input
            label="Keyword / Specialty"
            placeholder="e.g. cybersecurity, cloud"
            value={keywordFilter}
            onChange={(e) => setKeywordFilter(e.target.value)}
          />
          <Input
            label="Agency (filter results)"
            placeholder="e.g. DoD, VA, DHS"
            value={agencyFilter}
            onChange={(e) => setAgencyFilter(e.target.value)}
          />
          <Select
            label="Vendor Type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {VENDOR_TYPES.filter(Boolean).map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Loading…' : 'Search Vendors'}
        </Button>
      </div>

      {/* Results Table */}
      {filtered.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
          <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Vendors ({filtered.length})</h2>
          </div>
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['Company', 'Type', 'Agencies', 'Specialties', 'Awards', 'Total Value', 'Action'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{vendor.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={vendor.type} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {vendor.agencies.slice(0, 3).map((a) => (
                        <span key={a} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{a}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-600 max-w-xs">
                      {vendor.specialties.slice(0, 3).join(' · ')}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{vendor.recentAwardCount}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-700">{formatCurrency(vendor.totalAwardValue)}</td>
                  <td className="px-4 py-3">
                    <Button
                      size="xs"
                      variant={isSaved(vendor.id) ? 'secondary' : 'primary'}
                      onClick={() => isSaved(vendor.id) ? removePrime(vendor.id) : savePrime(vendor)}
                    >
                      {isSaved(vendor.id) ? '✓ Saved' : 'Save'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : searched && !loading ? (
        <EmptyState icon="🏢" title="No vendors found" description="Try adjusting your filters." />
      ) : null}

      {/* Saved Primes */}
      {savedPrimes.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-5 py-3.5 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">Saved Partners ({savedPrimes.length})</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {savedPrimes.map((vendor) => (
              <div key={vendor.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{vendor.name}</span>
                      <Badge label={vendor.type} />
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {vendor.specialties?.join(' · ')}
                    </div>
                    {vendor.notes ? (
                      <div className="text-xs text-gray-500 italic mt-1">{vendor.notes}</div>
                    ) : null}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="xs" variant="ghost" onClick={() => { setEditNotesId(vendor.id); setEditNotesValue(vendor.notes || '') }}>
                      Notes
                    </Button>
                    <Button size="xs" variant="danger" onClick={() => removePrime(vendor.id)}>×</Button>
                  </div>
                </div>
                {editNotesId === vendor.id && (
                  <div className="mt-2 flex gap-2">
                    <Textarea
                      value={editNotesValue}
                      onChange={(e) => setEditNotesValue(e.target.value)}
                      placeholder="Add notes about this partner..."
                      rows={2}
                      className="flex-1"
                    />
                    <div className="flex flex-col gap-1">
                      <Button size="xs" onClick={() => updateNotes(vendor.id, editNotesValue)}>Save</Button>
                      <Button size="xs" variant="ghost" onClick={() => setEditNotesId(null)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
