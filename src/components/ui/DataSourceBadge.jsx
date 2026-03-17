export default function DataSourceBadge({ isMock = true }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
        isMock
          ? 'bg-amber-50 text-amber-700 border-amber-300'
          : 'bg-green-50 text-green-700 border-green-300'
      }`}
      title={isMock ? 'Using mock/sample data' : 'Connected to live API'}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isMock ? 'bg-amber-500' : 'bg-green-500'}`} />
      {isMock ? 'Mock Data' : 'Live Data'}
    </span>
  )
}
