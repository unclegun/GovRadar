import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { AgencyIntelligencePage } from './pages/AgencyIntelligencePage'
import { CapabilityStatementPage } from './pages/CapabilityStatementPage'
import { DashboardPage } from './pages/DashboardPage'
import { OpportunitySearchPage } from './pages/OpportunitySearchPage'
import { PipelinePage } from './pages/PipelinePage'
import { PrimeFinderPage } from './pages/PrimeFinderPage'
import { SettingsPage } from './pages/SettingsPage'
import { WatchlistPage } from './pages/WatchlistPage'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/search" element={<OpportunitySearchPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/agency-intelligence" element={<AgencyIntelligencePage />} />
        <Route path="/prime-finder" element={<PrimeFinderPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/capability-builder" element={<CapabilityStatementPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
