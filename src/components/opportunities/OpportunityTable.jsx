import { useState } from 'react'
import OpportunityRow from './OpportunityRow.jsx'

const SORT_FIELDS = ['title', 'agency', 'postedDate', 'dueDate', 'estimatedValue', 'naics', 'setAside']

export default function OpportunityTable({ opportunities, onRowClick, profile }) {
  const [sortField, setSortField] = useState('postedDate')
  const [sortDir, setSortDir] = useState('desc')

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sorted = [...opportunities].sort((a, b) => {
    let av = a[sortField]
    let bv = b[sortField]
    if (typeof av === 'string') av = av.toLowerCase()
    if (typeof bv === 'string') bv = bv.toLowerCase()
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="ml-1 text-gray-300">↕</span>
    return <span className="ml-1 text-blue-500">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const HeaderCell = ({ field, label, align = 'left' }) => (
    <th
      className={`px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none hover:bg-gray-100 ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
      onClick={() => handleSort(field)}
    >
      {label}
      <SortIcon field={field} />
    </th>
  )

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <HeaderCell field="title" label="Title" />
            <HeaderCell field="agency" label="Agency" />
            <HeaderCell field="postedDate" label="Posted" />
            <HeaderCell field="dueDate" label="Due" />
            <HeaderCell field="naics" label="NAICS" />
            <HeaderCell field="setAside" label="Set-Aside" />
            <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Fit Score
            </th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-12 text-center text-sm text-gray-400">
                No opportunities found
              </td>
            </tr>
          ) : (
            sorted.map((opp) => (
              <OpportunityRow
                key={opp.id}
                opportunity={opp}
                profile={profile}
                onClick={() => onRowClick(opp)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
