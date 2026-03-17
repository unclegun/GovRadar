import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { navItems } from './navConfig'

function navClass({ isActive }) {
  return `block rounded-lg px-3 py-2.5 text-sm font-medium ${
    isActive ? 'bg-brand-800 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
  }`
}

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">StrataStack</p>
          <p className="text-base font-semibold text-slate-900">Contract Radar</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      {open && (
        <nav className="mt-3 space-y-1 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={navClass}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}
