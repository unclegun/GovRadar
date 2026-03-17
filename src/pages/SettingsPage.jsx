import { useState } from 'react'
import { Card } from '../components/ui/Card'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { useBusinessProfile } from '../hooks/useBusinessProfile'
import { setStoredValue } from '../services/localStorageService'
import { parseJsonFile } from '../utils/importUtils'
import { exportToJson } from '../utils/exportUtils'

function parseList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function SettingsPage() {
  const { profile, setProfile, updateField, resetProfile } = useBusinessProfile()
  const [saveMessage, setSaveMessage] = useState('')

  const updateListField = (field, value) => {
    updateField(field, parseList(value))
  }

  const importSettings = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const payload = await parseJsonFile(file)
    setProfile(payload.businessProfile || payload)
  }

  const handleSave = () => {
    setStoredValue(STORAGE_KEYS.businessProfile, profile)
    setSaveMessage('Business profile saved to local storage.')
    window.setTimeout(() => setSaveMessage(''), 2200)
  }

  return (
    <div className="space-y-4">
      <header className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure business profile preferences and data portability tools.</p>
      </header>

      <Card title="Business Profile" subtitle="Used in opportunity scoring across the app.">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            Company Name
            <input
              className="input-modern"
              value={profile.companyName}
              onChange={(event) => updateField('companyName', event.target.value)}
            />
          </label>
          <label className="text-sm">
            Website
            <input
              className="input-modern"
              value={profile.website}
              onChange={(event) => updateField('website', event.target.value)}
            />
          </label>
          <label className="text-sm md:col-span-2">
            Short Description
            <textarea
              rows={2}
              className="input-modern"
              value={profile.shortDescription}
              onChange={(event) => updateField('shortDescription', event.target.value)}
            />
          </label>
          <label className="text-sm md:col-span-2">
            Core Service Keywords (comma-separated)
            <input
              className="input-modern"
              value={profile.coreKeywords.join(', ')}
              onChange={(event) => updateListField('coreKeywords', event.target.value)}
            />
          </label>
          <label className="text-sm md:col-span-2">
            Preferred Agencies (comma-separated)
            <input
              className="input-modern"
              value={profile.preferredAgencies.join(', ')}
              onChange={(event) => updateListField('preferredAgencies', event.target.value)}
            />
          </label>
          <label className="text-sm">
            NAICS Codes
            <input
              className="input-modern"
              value={profile.naicsCodes.join(', ')}
              onChange={(event) => updateListField('naicsCodes', event.target.value)}
            />
          </label>
          <label className="text-sm">
            Certifications / Set-Asides
            <input
              className="input-modern"
              value={profile.certifications.join(', ')}
              onChange={(event) => updateListField('certifications', event.target.value)}
            />
          </label>
          <label className="text-sm">
            Preferred Size Min ($)
            <input
              type="number"
              className="input-modern"
              value={profile.contractSize.min}
              onChange={(event) =>
                updateField('contractSize', { ...profile.contractSize, min: Number(event.target.value) })
              }
            />
          </label>
          <label className="text-sm">
            Preferred Size Max ($)
            <input
              type="number"
              className="input-modern"
              value={profile.contractSize.max}
              onChange={(event) =>
                updateField('contractSize', { ...profile.contractSize, max: Number(event.target.value) })
              }
            />
          </label>
          <label className="text-sm md:col-span-2">
            Tech Stack Keywords
            <input
              className="input-modern"
              value={profile.techStackKeywords.join(', ')}
              onChange={(event) => updateListField('techStackKeywords', event.target.value)}
            />
          </label>
          <label className="text-sm md:col-span-2">
            Excluded Keywords
            <input
              className="input-modern"
              value={profile.excludedKeywords.join(', ')}
              onChange={(event) => updateListField('excludedKeywords', event.target.value)}
            />
          </label>
          <label className="text-sm md:col-span-2">
            Capability Statement Contact Info
            <input
              className="input-modern"
              value={profile.contactInfo}
              onChange={(event) => updateField('contactInfo', event.target.value)}
            />
          </label>
        </div>

        <div className="action-wrap mt-4">
          <button type="button" onClick={handleSave} className="btn-primary w-full sm:w-auto">
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => exportToJson('stratastack-settings.json', { businessProfile: profile })}
            className="btn-secondary w-full sm:w-auto"
          >
            Export Settings JSON
          </button>
          <label className="btn-secondary w-full cursor-pointer text-center sm:w-auto">
            Import Settings JSON
            <input type="file" accept="application/json" className="hidden" onChange={importSettings} />
          </label>
          <button type="button" onClick={resetProfile} className="btn-secondary w-full sm:w-auto">
            Reset Profile
          </button>
        </div>
        {saveMessage && <p className="mt-3 text-sm font-semibold text-emerald-700">{saveMessage}</p>}
      </Card>
    </div>
  )
}
