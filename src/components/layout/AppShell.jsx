import { Outlet } from 'react-router-dom'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'

export function AppShell() {
  return (
    <div className="app-shell-bg min-h-screen text-slate-900">
      <MobileNav />
      <div className="content-wrap flex lg:min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4 pb-10 md:p-6 md:pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
