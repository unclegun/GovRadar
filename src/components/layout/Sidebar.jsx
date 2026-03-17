import { NavLink } from 'react-router-dom'
import { navItems } from './navConfig'

function navClass({ isActive }) {
  return `block rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-brand-800 text-white'
      : 'text-slate-700 hover:bg-slate-200 hover:text-slate-950'
  }`
}

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">StrataStack</p>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Contract Radar</h1>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} end={item.path === '/'} className={navClass}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
