import { NavLink } from 'react-router-dom'
import { navItems } from './navConfig'

function navClass({ isActive }) {
  return `block rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-brand-800 text-white shadow-sm'
      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
  }`
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200/80 bg-white/90 p-4 backdrop-blur lg:block">
      <div className="mb-6 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">StrataStack</p>
        <h1 className="text-xl font-semibold text-slate-900">Contract Radar</h1>
        <p className="mt-2 text-xs text-slate-600">Federal opportunity intelligence workspace</p>
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Navigation</p>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} end={item.path === '/'} className={navClass}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        Tip: Save presets in Opportunity Search to speed up recurring market scans.
      </div>
    </aside>
  )
}
