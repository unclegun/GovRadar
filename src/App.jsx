import { Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell.jsx'
import Dashboard from './pages/Dashboard.jsx'
import OpportunitySearch from './pages/OpportunitySearch.jsx'
import Watchlist from './pages/Watchlist.jsx'
import AgencyIntelligence from './pages/AgencyIntelligence.jsx'
import PrimeFinder from './pages/PrimeFinder.jsx'
import Pipeline from './pages/Pipeline.jsx'
import CapabilityStatement from './pages/CapabilityStatement.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="search" element={<OpportunitySearch />} />
        <Route path="watchlist" element={<Watchlist />} />
        <Route path="agencies" element={<AgencyIntelligence />} />
        <Route path="primes" element={<PrimeFinder />} />
        <Route path="pipeline" element={<Pipeline />} />
        <Route path="capability" element={<CapabilityStatement />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
