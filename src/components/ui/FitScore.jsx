import { useState } from 'react'

function getScoreColor(score) {
  if (score >= 75) return { text: 'text-green-600', bg: 'bg-green-500', track: 'bg-green-100' }
  if (score >= 50) return { text: 'text-blue-600', bg: 'bg-blue-500', track: 'bg-blue-100' }
  if (score >= 25) return { text: 'text-amber-600', bg: 'bg-amber-500', track: 'bg-amber-100' }
  return { text: 'text-red-600', bg: 'bg-red-500', track: 'bg-red-100' }
}

export default function FitScore({ score, breakdown, positives, warnings, compact = false }) {
  const [expanded, setExpanded] = useState(false)
  const colors = getScoreColor(score)

  if (compact) {
    return (
      <span className={`font-bold text-sm ${colors.text}`}>{score}</span>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className={`text-2xl font-bold ${colors.text}`}>{score}</div>
        <div className="flex-1">
          <div className={`h-2 rounded-full ${colors.track}`}>
            <div
              className={`h-2 rounded-full ${colors.bg} transition-all`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Fit Score / 100</div>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-blue-600 hover:underline"
        >
          {expanded ? 'Hide' : 'Details'}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 space-y-3">
          {breakdown && (
            <div>
              <div className="text-xs font-medium text-gray-600 mb-1">Score Breakdown</div>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(breakdown).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1">
                    <span className="text-gray-600 capitalize">{key}</span>
                    <span className={`font-semibold ${val < 0 ? 'text-red-600' : 'text-gray-800'}`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {positives?.length > 0 && (
            <div>
              <div className="text-xs font-medium text-green-700 mb-1">✓ Positives</div>
              <ul className="space-y-0.5">
                {positives.map((p, i) => (
                  <li key={i} className="text-xs text-gray-700">• {p}</li>
                ))}
              </ul>
            </div>
          )}

          {warnings?.length > 0 && (
            <div>
              <div className="text-xs font-medium text-amber-700 mb-1">⚠ Warnings</div>
              <ul className="space-y-0.5">
                {warnings.map((w, i) => (
                  <li key={i} className="text-xs text-gray-700">• {w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
