import { useState } from 'react'
import { useBusinessProfile } from '../hooks/useBusinessProfile.js'
import { exportToJSON, importFromJSON } from '../utils/jsonExport.js'
import { STORAGE_KEYS, removeItem } from '../utils/storage.js'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Textarea from '../components/ui/Textarea.jsx'
import Modal from '../components/ui/Modal.jsx'

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function ListEditor({ label, items = [], onChange, placeholder }) {
  const [draft, setDraft] = useState('')

  const addItem = () => {
    if (!draft.trim()) return
    onChange([...items, draft.trim()])
    setDraft('')
  }

  return (
    <div>
      {label && <div className="text-xs font-medium text-gray-700 mb-1.5">{label}</div>}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-800 text-xs rounded-full border border-blue-200">
            {item}
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-blue-400 hover:text-red-500">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <Button size="sm" onClick={addItem}>Add</Button>
      </div>
    </div>
  )
}

const CERTIFICATIONS_OPTIONS = ['Small Business', '8(a)', 'SDVOSB', 'HUBZone', 'WOSB', 'Economically Disadvantaged WOSB', 'AbilityOne', 'SDB']

export default function Settings() {
  const [profile, setProfile] = useBusinessProfile()
  const [showClearModal, setShowClearModal] = useState(false)
  const [importError, setImportError] = useState(null)

  const update = (field) => (e) =>
    setProfile((prev) => ({ ...prev, [field]: e.target.value }))

  const updateList = (field) => (newList) =>
    setProfile((prev) => ({ ...prev, [field]: newList }))

  const toggleCert = (cert) => {
    const certs = profile.certifications || []
    const exists = certs.includes(cert)
    setProfile((prev) => ({
      ...prev,
      certifications: exists ? certs.filter((c) => c !== cert) : [...certs, cert],
    }))
  }

  const handleExport = () => exportToJSON(profile, 'business_profile.json')

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImportError(null)
    importFromJSON(file)
      .then((data) => setProfile((prev) => ({ ...prev, ...data })))
      .catch((err) => setImportError(err.message))
  }

  const handleClearAll = () => {
    Object.values(STORAGE_KEYS).forEach((key) => removeItem(key))
    setShowClearModal(false)
    window.location.reload()
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Configure your business profile to improve opportunity scoring</p>
      </div>

      <Section title="Company Information">
        <Input label="Company Name" value={profile.companyName || ''} onChange={update('companyName')} />
        <Textarea label="Company Description" value={profile.description || ''} onChange={update('description')} rows={2} />
        <Input label="Website" value={profile.website || ''} onChange={update('website')} />
      </Section>

      <Section title="Contact Information">
        <Input label="Contact Name" value={profile.contactName || ''} onChange={update('contactName')} />
        <Input label="Contact Email" type="email" value={profile.contactEmail || ''} onChange={update('contactEmail')} />
        <Input label="Contact Phone" value={profile.contactPhone || ''} onChange={update('contactPhone')} />
      </Section>

      <Section title="Certifications / Set-Asides">
        <div className="flex flex-wrap gap-2">
          {CERTIFICATIONS_OPTIONS.map((cert) => {
            const selected = (profile.certifications || []).includes(cert)
            return (
              <button
                key={cert}
                onClick={() => toggleCert(cert)}
                className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-colors ${
                  selected
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                {cert}
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="NAICS Codes">
        <ListEditor
          label="Your registered NAICS codes (used for fit scoring)"
          items={profile.naicsCodes || []}
          onChange={updateList('naicsCodes')}
          placeholder="e.g. 541511"
        />
      </Section>

      <Section title="Preferred Agencies">
        <ListEditor
          items={profile.preferredAgencies || []}
          onChange={updateList('preferredAgencies')}
          placeholder="e.g. Department of Defense"
        />
      </Section>

      <Section title="Keywords & Tech Stack (for scoring)">
        <ListEditor
          label="Keywords (terms in opportunity titles/descriptions that indicate a good match)"
          items={profile.keywords || []}
          onChange={updateList('keywords')}
          placeholder="e.g. cloud, cybersecurity, agile"
        />
        <ListEditor
          label="Tech Keywords"
          items={profile.techKeywords || []}
          onChange={updateList('techKeywords')}
          placeholder="e.g. AWS, Kubernetes, Python"
        />
        <ListEditor
          label="Excluded Keywords (reduces score if found)"
          items={profile.excludedKeywords || []}
          onChange={updateList('excludedKeywords')}
          placeholder="e.g. construction, hardware"
        />
      </Section>

      <Section title="Contract Size Range">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Minimum ($)"
            type="number"
            value={profile.contractSizeMin ?? 100000}
            onChange={(e) => setProfile((prev) => ({ ...prev, contractSizeMin: Number(e.target.value) }))}
          />
          <Input
            label="Maximum ($)"
            type="number"
            value={profile.contractSizeMax ?? 5000000}
            onChange={(e) => setProfile((prev) => ({ ...prev, contractSizeMax: Number(e.target.value) }))}
          />
        </div>
      </Section>

      <Section title="Data Management">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" onClick={handleExport}>
            Export Profile (JSON)
          </Button>
          <label className="inline-flex items-center gap-2 cursor-pointer px-3 py-1.5 text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md shadow-sm">
            Import Profile (JSON)
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
          <Button variant="danger" size="sm" onClick={() => setShowClearModal(true)}>
            Clear All Data
          </Button>
        </div>
        {importError && (
          <div className="text-xs text-red-600 mt-1">Error: {importError}</div>
        )}
      </Section>

      {/* Clear All Confirmation Modal */}
      <Modal isOpen={showClearModal} onClose={() => setShowClearModal(false)} title="Clear All Data">
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            This will permanently delete all your saved data including your watchlist, pipeline, presets, business profile, and capability statement. This cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={() => setShowClearModal(false)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleClearAll}>Yes, Clear All Data</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
