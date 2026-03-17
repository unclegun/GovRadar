import { useState } from 'react'
import { useCapabilityStatement } from '../hooks/useCapabilityStatement.js'
import { defaultCapabilityStatement } from '../data/mockCapabilityStatement.js'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Textarea from '../components/ui/Textarea.jsx'

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</h3>
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
      {label && <div className="text-xs font-medium text-gray-700 mb-1">{label}</div>}
      <div className="space-y-1 mb-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm bg-gray-50 px-2 py-1 rounded">
            <span className="flex-1">{item}</span>
            <button
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-gray-400 hover:text-red-500 text-xs"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <button
          onClick={addItem}
          className="px-2 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </div>
  )
}

export default function CapabilityStatement() {
  const [statement, setStatement] = useCapabilityStatement()
  const [activeTab, setActiveTab] = useState('edit')

  const update = (field) => (e) =>
    setStatement((prev) => ({ ...prev, [field]: e.target.value }))

  const updateList = (field) => (newList) =>
    setStatement((prev) => ({ ...prev, [field]: newList }))

  const seedExample = () => setStatement(defaultCapabilityStatement)

  const handlePrint = () => window.print()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Capability Statement</h1>
          <p className="text-sm text-gray-500">Build and preview your government capability statement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={seedExample}>Load Example</Button>
          <Button size="sm" onClick={handlePrint}>Print / PDF</Button>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 w-fit">
        {['edit', 'preview'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Edit Pane */}
        {activeTab === 'edit' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-1">
            <Section title="Company Info">
              <Input label="Company Name" value={statement.companyName} onChange={update('companyName')} />
              <Input label="Tagline" value={statement.tagline} onChange={update('tagline')} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="UEI / DUNS" value={statement.dunsUei} onChange={update('dunsUei')} />
                <Input label="CAGE Code" value={statement.cageCode} onChange={update('cageCode')} />
              </div>
              <Input label="Website" value={statement.website} onChange={update('website')} />
              <Input label="Address" value={statement.address} onChange={update('address')} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Phone" value={statement.phone} onChange={update('phone')} />
                <Input label="Email" value={statement.email} onChange={update('email')} />
              </div>
              <Input label="Point of Contact" value={statement.pointOfContact} onChange={update('pointOfContact')} />
            </Section>

            <Section title="Core Competencies">
              <ListEditor
                items={statement.coreCompetencies}
                onChange={updateList('coreCompetencies')}
                placeholder="Add a core competency…"
              />
            </Section>

            <Section title="Differentiators">
              <ListEditor
                items={statement.differentiators}
                onChange={updateList('differentiators')}
                placeholder="Add a differentiator…"
              />
            </Section>

            <Section title="Certifications & Set-Asides">
              <ListEditor
                items={statement.certifications}
                onChange={updateList('certifications')}
                placeholder="e.g. 8(a), SDVOSB, ISO 9001…"
              />
            </Section>

            <Section title="Team Highlights">
              <Textarea
                label="Team Description"
                value={statement.teamHighlights}
                onChange={update('teamHighlights')}
                rows={3}
              />
            </Section>
          </div>
        )}

        {/* Preview Pane */}
        {(activeTab === 'preview' || true) && (
          <div
            className={`bg-white rounded-lg border border-gray-200 shadow-sm ${
              activeTab === 'edit' ? 'hidden xl:block' : ''
            }`}
          >
            <CapabilityStatementPreview statement={statement} />
          </div>
        )}
      </div>
    </div>
  )
}

function CapabilityStatementPreview({ statement }) {
  return (
    <div className="p-6 font-sans text-gray-900 text-sm print:p-4" id="cap-statement-print">
      {/* Header */}
      <div className="border-b-4 border-blue-600 pb-3 mb-4">
        <h1 className="text-2xl font-bold text-blue-700">{statement.companyName || 'Company Name'}</h1>
        <p className="text-sm text-gray-500 italic mt-0.5">{statement.tagline}</p>
        <div className="flex flex-wrap gap-4 text-xs text-gray-600 mt-2">
          {statement.dunsUei && <span><strong>UEI:</strong> {statement.dunsUei}</span>}
          {statement.cageCode && <span><strong>CAGE:</strong> {statement.cageCode}</span>}
          {statement.website && <span><strong>Web:</strong> {statement.website}</span>}
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {statement.address} · {statement.phone} · {statement.email}
        </div>
        {statement.pointOfContact && (
          <div className="text-xs text-gray-600 mt-0.5"><strong>POC:</strong> {statement.pointOfContact}</div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          {/* Core Competencies */}
          <div className="mb-4">
            <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200 pb-1 mb-2">Core Competencies</h2>
            <ul className="space-y-1">
              {(statement.coreCompetencies || []).map((c, i) => (
                <li key={i} className="text-xs flex items-start gap-1.5">
                  <span className="text-blue-500 mt-0.5">▸</span>{c}
                </li>
              ))}
            </ul>
          </div>

          {/* Differentiators */}
          <div className="mb-4">
            <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200 pb-1 mb-2">Differentiators</h2>
            <ul className="space-y-1">
              {(statement.differentiators || []).map((d, i) => (
                <li key={i} className="text-xs flex items-start gap-1.5">
                  <span className="text-green-500 mt-0.5">✓</span>{d}
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200 pb-1 mb-2">Certifications & Set-Asides</h2>
            <div className="flex flex-wrap gap-1.5">
              {(statement.certifications || []).map((c, i) => (
                <span key={i} className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded">{c}</span>
              ))}
            </div>
          </div>
        </div>

        <div>
          {/* Past Performance */}
          {statement.pastPerformance?.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200 pb-1 mb-2">Past Performance</h2>
              <div className="space-y-3">
                {statement.pastPerformance.map((pp) => (
                  <div key={pp.id} className="border-l-2 border-blue-200 pl-2">
                    <div className="text-xs font-semibold text-gray-900">{pp.client}</div>
                    <div className="text-xs font-medium text-blue-700">{pp.title}</div>
                    <div className="text-xs text-gray-500">{pp.value} · {pp.period}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{pp.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NAICS */}
          {statement.naicsCodes?.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200 pb-1 mb-2">NAICS Codes</h2>
              <div className="space-y-1">
                {statement.naicsCodes.map((n) => (
                  <div key={n.code} className="text-xs">
                    <span className="font-mono font-semibold text-gray-800">{n.code}</span>
                    <span className="text-gray-500 ml-2">{n.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team */}
          {statement.teamHighlights && (
            <div>
              <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200 pb-1 mb-2">Our Team</h2>
              <p className="text-xs text-gray-700 leading-relaxed">{statement.teamHighlights}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
