import { scoreOpportunity } from '../../utils/scoreOpportunity.js'
import { formatDate, formatCurrency, formatDaysUntil, truncate } from '../../utils/formatters.js'
import Badge from '../ui/Badge.jsx'
import FitScore from '../ui/FitScore.jsx'

export default function OpportunityRow({ opportunity, profile, onClick }) {
  const scored = profile ? scoreOpportunity(opportunity, profile) : null
  const daysUntil = formatDaysUntil(opportunity.dueDate)
  const isPastDue = opportunity.dueDate && new Date(opportunity.dueDate) < new Date()

  return (
    <tr
      className="hover:bg-blue-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <td className="px-4 py-3">
        <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={opportunity.title}>
          {truncate(opportunity.title, 60)}
        </div>
        <div className="text-xs text-gray-500">{opportunity.solicitationNumber}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-gray-700 whitespace-nowrap">{opportunity.agency}</div>
        <div className="text-xs text-gray-400">{opportunity.location}</div>
      </td>
      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
        {formatDate(opportunity.postedDate)}
      </td>
      <td className="px-4 py-3">
        <div className={`text-xs whitespace-nowrap font-medium ${isPastDue ? 'text-red-600' : 'text-gray-700'}`}>
          {formatDate(opportunity.dueDate)}
        </div>
        <div className={`text-xs ${isPastDue ? 'text-red-500' : 'text-gray-400'}`}>{daysUntil}</div>
      </td>
      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
        <span className="font-mono">{opportunity.naics}</span>
      </td>
      <td className="px-4 py-3">
        <Badge label={opportunity.setAside} />
      </td>
      <td className="px-4 py-3 text-right">
        {scored ? (
          <FitScore score={scored.total} compact />
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="text-xs text-gray-500 whitespace-nowrap text-right">
          {formatCurrency(opportunity.estimatedValue)}
        </div>
      </td>
    </tr>
  )
}
