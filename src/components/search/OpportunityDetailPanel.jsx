import { Card } from '../ui/Card'
import { formatCurrency, formatDate } from '../../utils/formatters'

export function OpportunityDetailPanel({
  opportunity,
  score,
  onSave,
  onClose,
  isSaved,
}) {
  if (!opportunity) return null

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-slate-900/35">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Opportunity Detail</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-slate-300 px-2 py-1 text-sm"
          >
            Close
          </button>
        </div>

        <Card title={opportunity.title} subtitle={opportunity.agency}>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-slate-500">Posted</dt>
              <dd>{formatDate(opportunity.postedDate)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Due</dt>
              <dd>{formatDate(opportunity.dueDate)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">NAICS</dt>
              <dd>{opportunity.naics}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Set-aside</dt>
              <dd>{opportunity.setAside}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Est. Value</dt>
              <dd>{formatCurrency(opportunity.estimatedValue)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Fit Score</dt>
              <dd className="font-semibold text-brand-800">{score.total}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Summary" className="mt-4">
          <p className="text-sm leading-6 text-slate-700">{opportunity.description}</p>
          <a
            className="mt-3 inline-block text-sm font-semibold text-brand-700 underline"
            href={opportunity.url}
            target="_blank"
            rel="noreferrer"
          >
            View official source
          </a>
        </Card>

        <Card title="Scoring Explanation" className="mt-4">
          <ul className="space-y-1 text-sm text-slate-700">
            {score.reasons.map((reason) => (
              <li key={reason}>+ {reason}</li>
            ))}
            {score.warnings.map((warning) => (
              <li key={warning} className="text-amber-700">
                ! {warning}
              </li>
            ))}
          </ul>
        </Card>

        <button
          type="button"
          onClick={() => onSave(opportunity)}
          className="mt-4 w-full rounded-lg bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900"
          disabled={isSaved}
        >
          {isSaved ? 'Already Saved to Watchlist' : 'Save to Watchlist'}
        </button>
      </div>
    </div>
  )
}
