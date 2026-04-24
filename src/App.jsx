import { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import LeaveTypes from './pages/LeaveTypes'
import './index.css'

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <AppProvider>
      <HashRouter>
        <div className="flex min-h-screen">
          <Sidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed(c => !c)}
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
          />

          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile top bar */}
            <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-10">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>
              <span className="font-bold text-slate-800">HR Tracker</span>
            </header>

            <main className="flex-1 overflow-auto bg-slate-50">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/leave-types" element={<LeaveTypes />} />
              </Routes>
            </main>
          </div>
        </div>
      </HashRouter>
    </AppProvider>
  )
}
