import { useRef, useState } from 'react'
import { Card } from '../components/ui/Card'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { useCapabilityStatement } from '../hooks/useCapabilityStatement'
import { setStoredValue } from '../services/localStorageService'

const fields = [
  ['companyName', 'Company Name'],
  ['uei', 'UEI'],
  ['cage', 'CAGE'],
  ['contactName', 'Contact Name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['website', 'Website'],
  ['address', 'Address'],
]

const textareas = [
  ['coreCompetencies', 'Core Competencies'],
  ['differentiators', 'Differentiators'],
  ['naics', 'NAICS'],
  ['psc', 'PSC'],
  ['pastPerformance', 'Past Performance'],
  ['certifications', 'Certifications'],
  ['contractVehicles', 'Contract Vehicles'],
]

export function CapabilityStatementPage() {
  const { statement, setStatement, resetStatement } = useCapabilityStatement()
  const fileRef = useRef(null)
  const [saveMessage, setSaveMessage] = useState('')

  const update = (key, value) => {
    setStatement((prev) => ({ ...prev, [key]: value }))
  }

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => update('logoDataUrl', String(reader.result))
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    setStoredValue(STORAGE_KEYS.capabilityStatement, statement)
    setSaveMessage('Capability statement saved to local storage.')
    window.setTimeout(() => setSaveMessage(''), 2200)
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card title="Capability Statement Builder" subtitle="Draft and confirm saves for your one-page statement.">
        <div className="space-y-3">
          <div className="action-wrap">
            <button type="button" className="btn-secondary w-full sm:w-auto" onClick={() => fileRef.current?.click()}>
              Upload Logo
            </button>
            <button type="button" className="btn-secondary w-full sm:w-auto" onClick={resetStatement}>
              Reset to Seeded Example
            </button>
            <button type="button" className="btn-primary w-full sm:w-auto" onClick={handleSave}>
              Save Changes
            </button>
            <button type="button" className="btn-primary w-full sm:w-auto" onClick={() => window.print()}>
              Print / Save as PDF
            </button>
          </div>
          {saveMessage && <p className="text-sm font-semibold text-emerald-700">{saveMessage}</p>}
          <input ref={fileRef} onChange={handleLogoUpload} className="hidden" type="file" accept="image/*" />

          <div className="grid gap-2 md:grid-cols-2">
            {fields.map(([key, label]) => (
              <label key={key} className="text-sm">
                <span className="mb-1 block text-slate-600">{label}</span>
                <input
                  value={statement[key] || ''}
                  onChange={(event) => update(key, event.target.value)}
                  className="input-modern"
                />
              </label>
            ))}
          </div>

          {textareas.map(([key, label]) => (
            <label key={key} className="block text-sm">
              <span className="mb-1 block text-slate-600">{label}</span>
              <textarea
                rows={3}
                value={statement[key] || ''}
                onChange={(event) => update(key, event.target.value)}
                className="input-modern"
              />
            </label>
          ))}
        </div>
      </Card>

      <Card title="Live Preview" className="print-container">
        <article className="mx-auto max-w-[760px] rounded border border-slate-200 bg-white p-4 text-sm text-slate-800 print:shadow-none sm:p-6">
          <header className="border-b border-slate-200 pb-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{statement.companyName}</h1>
                <p className="mt-1 text-slate-600">Capability Statement</p>
              </div>
              <div className="h-16 w-28 overflow-hidden rounded border border-slate-200 bg-slate-50">
                {statement.logoDataUrl ? (
                  <img src={statement.logoDataUrl} alt="Company logo" className="h-full w-full object-contain" />
                ) : (
                  <div className="grid h-full place-items-center text-xs text-slate-500">Logo</div>
                )}
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-600">
              UEI: {statement.uei} | CAGE: {statement.cage} | {statement.website}
            </p>
          </header>

          <section className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <h2 className="font-semibold text-slate-900">Core Competencies</h2>
              <p className="mt-1 leading-6">{statement.coreCompetencies}</p>
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Differentiators</h2>
              <p className="mt-1 leading-6">{statement.differentiators}</p>
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Past Performance</h2>
              <p className="mt-1 leading-6">{statement.pastPerformance}</p>
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Codes and Certifications</h2>
              <p className="mt-1 leading-6">NAICS: {statement.naics}</p>
              <p className="leading-6">PSC: {statement.psc}</p>
              <p className="leading-6">{statement.certifications}</p>
            </div>
          </section>

          <section className="mt-4 border-t border-slate-200 pt-3 text-xs text-slate-700">
            <p>
              Contact: {statement.contactName} | {statement.email} | {statement.phone}
            </p>
            <p className="mt-1">Address: {statement.address}</p>
            <p className="mt-1">Contract Vehicles: {statement.contractVehicles}</p>
          </section>
        </article>
      </Card>
    </div>
  )
}
