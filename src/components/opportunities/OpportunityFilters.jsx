import Input from '../ui/Input.jsx'
import Select from '../ui/Select.jsx'
import Button from '../ui/Button.jsx'

const SET_ASIDES = [
  '', 'Small Business', '8(a)', 'SDVOSB', 'HUBZone', 'WOSB', 'Unrestricted',
]

const AGENCIES = [
  '',
  'Department of Defense',
  'Department of Veterans Affairs',
  'Department of Homeland Security',
  'General Services Administration',
  'Department of Health and Human Services',
  'Department of Energy',
  'Department of the Treasury',
  'Department of Agriculture',
  'Social Security Administration',
  'Environmental Protection Agency',
  'Department of State',
]

export default function OpportunityFilters({ filters, onChange, onSearch, loading }) {
  const handleChange = (field) => (e) => onChange({ ...filters, [field]: e.target.value })

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        <Input
          label="Keyword"
          placeholder="e.g. cloud, cybersecurity"
          value={filters.keyword || ''}
          onChange={handleChange('keyword')}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <Select
          label="Agency"
          value={filters.agency || ''}
          onChange={handleChange('agency')}
        >
          <option value="">All Agencies</option>
          {AGENCIES.filter(Boolean).map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </Select>
        <Input
          label="NAICS Code"
          placeholder="e.g. 541511"
          value={filters.naics || ''}
          onChange={handleChange('naics')}
          maxLength={6}
        />
        <Select
          label="Set-Aside"
          value={filters.setAside || ''}
          onChange={handleChange('setAside')}
        >
          <option value="">All Set-Asides</option>
          {SET_ASIDES.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Input
          label="Posted After"
          type="date"
          value={filters.postedAfter || ''}
          onChange={handleChange('postedAfter')}
        />
      </div>
      <div className="flex items-center gap-2 mt-3">
        <Button onClick={onSearch} disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            onChange({ keyword: '', agency: '', naics: '', setAside: '', postedAfter: '' })
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  )
}
