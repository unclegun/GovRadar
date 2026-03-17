export default function StatCard({ title, value, subtitle, icon, accentColor = 'blue' }) {
  const accentMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    slate: 'bg-slate-50 text-slate-600',
  }
  const accentClass = accentMap[accentColor] || accentMap.blue

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`p-2 rounded-lg ${accentClass} ml-3 flex-shrink-0`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
