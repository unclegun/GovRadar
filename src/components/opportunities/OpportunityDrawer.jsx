import { useEffect } from 'react'
import { scoreOpportunity } from '../../utils/scoreOpportunity.js'
import { formatDate, formatCurrency, formatDaysUntil } from '../../utils/formatters.js'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import FitScore from '../ui/FitScore.jsx'

export default function OpportunityDrawer({ opportunity, profile, onClose, onSave, onAddToPipeline, isWatched }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!opportunity) return null

  const scored = profile ? scoreOpportunity(opportunity, profile) : null
  const isPastDue = opportunity.dueDate && new Date(opportunity.dueDate) < new Date()

  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-black/30"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-40 w-full max-w-xl bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-base font-semibold text-gray-900 leading-snug">{opportunity.title}</h2>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <Badge label={opportunity.status} />
              <Badge label={opportunity.setAside} />
              <span className="text-xs text-gray-500">{opportunity.solicitationNumber}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-200 flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Agency', value: opportunity.agency },
              { label: 'NAICS', value: opportunity.naics },
              { label: 'Contract Type', value: opportunity.contractType },
              { label: 'Est. Value', value: formatCurrency(opportunity.estimatedValue) },
              { label: 'Posted', value: formatDate(opportunity.postedDate) },
              {
                label: 'Due Date',
                value: (
                  <span className={isPastDue ? 'text-red-600 font-semibold' : ''}>
                    {formatDate(opportunity.dueDate)} ({formatDaysUntil(opportunity.dueDate)})
                  </span>
                ),
              },
              { label: 'Location', value: opportunity.location },
              { label: 'Performance', value: opportunity.placeOfPerformance },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-md px-3 py-2">
                <div className="text-xs text-gray-500">{label}</div>
                <div className="text-sm font-medium text-gray-900 mt-0.5">{value}</div>
              </div>
            ))}
          </div>

          {/* Keywords */}
          {opportunity.keywords?.length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-500 mb-2">Keywords</div>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.keywords.map((kw) => (
                  <span key={kw} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">Description</div>
            <p className="text-sm text-gray-700 leading-relaxed">{opportunity.description}</p>
          </div>

          {/* Fit Score */}
          {scored && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-xs font-medium text-gray-500 mb-3">Fit Score Analysis</div>
              <FitScore
                score={scored.total}
                breakdown={scored.breakdown}
                positives={scored.positives}
                warnings={scored.warnings}
              />
            </div>
          )}

          {/* SAM Link */}
          <a
            href={opportunity.samUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on SAM.gov
          </a>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex gap-2 flex-wrap">
          <Button
            variant={isWatched ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => onSave(opportunity)}
            disabled={isWatched}
          >
            {isWatched ? '✓ Saved to Watchlist' : '+ Save to Watchlist'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAddToPipeline(opportunity)}
          >
            Add to Pipeline
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </>
  )
}
