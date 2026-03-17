export default function TopNav({ onMenuClick }) {
  return (
    <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-slate-900 text-white border-b border-slate-700">
      <button
        onClick={onMenuClick}
        className="p-1 rounded text-slate-300 hover:text-white"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div>
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">StrataStack </span>
        <span className="text-sm font-bold">Contract Radar</span>
      </div>
    </div>
  )
}
