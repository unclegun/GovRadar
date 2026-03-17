import { Card } from '../components/ui/Card'
import { useBusinessProfile } from '../hooks/useBusinessProfile'
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

  const updateListField = (field, value) => {
    updateField(field, parseList(value))
  }

  const importSettings = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const payload = await parseJsonFile(file)
    setProfile(payload.businessProfile || payload)
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-slate-600">Configure business profile preferences and data portability tools.</p>
      </header>

      <Card title="Business Profile" subtitle="Used in opportunity scoring across the app.">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            Company Name
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={profile.companyName}
              onChange={(event) => updateField('companyName', event.target.value)}
            />
          </label>
          <label className="text-sm">
            Website
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={profile.website}
              onChange={(event) => updateField('website', event.target.value)}
            />
          </label>
          <label className="text-sm md:col-span-2">
            Short Description
            <textarea
              rows={2}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={profile.shortDescription}
              onChange={(event) => updateField('shortDescription', event.target.value)}
            />
          </label>
          <label className="text-sm md:col-span-2">
            Core Service Keywords (comma-separated)
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={profile.coreKeywords.join(', ')}
              onChange={(event) => updateListField('coreKeywords', event.target.value)}
            />
          </label>
          <label className="text-sm md:col-span-2">
            Preferred Agencies (comma-separated)
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={profile.preferredAgencies.join(', ')}
              onChange={(event) => updateListField('preferredAgencies', event.target.value)}
            />
          </label>
          <label className="text-sm">
            NAICS Codes
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={profile.naicsCodes.join(', ')}
              onChange={(event) => updateListField('naicsCodes', event.target.value)}
            />
          </label>
          <label className="text-sm">
            Certifications / Set-Asides
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={profile.certifications.join(', ')}
              onChange={(event) => updateListField('certifications', event.target.value)}
            />
          </label>
          <label className="text-sm">
            Preferred Size Min ($)
            <input
              type="number"
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
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
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={profile.contractSize.max}
              onChange={(event) =>
                updateField('contractSize', { ...profile.contractSize, max: Number(event.target.value) })
              }
            />
          </label>
          <label className="text-sm md:col-span-2">
            Tech Stack Keywords
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={profile.techStackKeywords.join(', ')}
              onChange={(event) => updateListField('techStackKeywords', event.target.value)}
            />
          </label>
          <label className="text-sm md:col-span-2">
            Excluded Keywords
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={profile.excludedKeywords.join(', ')}
              onChange={(event) => updateListField('excludedKeywords', event.target.value)}
            />
          </label>
          <label className="text-sm md:col-span-2">
            Capability Statement Contact Info
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={profile.contactInfo}
              onChange={(event) => updateField('contactInfo', event.target.value)}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => exportToJson('stratastack-settings.json', { businessProfile: profile })}
            className="rounded bg-slate-800 px-3 py-2 text-sm font-semibold text-white"
          >
            Export Settings JSON
          </button>
          <label className="rounded border border-slate-300 px-3 py-2 text-sm">
            Import Settings JSON
            <input type="file" accept="application/json" className="hidden" onChange={importSettings} />
          </label>
          <button type="button" onClick={resetProfile} className="rounded border border-slate-300 px-3 py-2 text-sm">
            Reset Profile
          </button>
        </div>
      </Card>
    </div>
  )
}
