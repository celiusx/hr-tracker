import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import LeaveTypes from './pages/LeaveTypes'
import './index.css'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename="/hr-tracker">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-slate-50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/leave-types" element={<LeaveTypes />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
