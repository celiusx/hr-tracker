import { useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { AppProvider } from './context/AppContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import LeaveTypes from './pages/LeaveTypes'
import Users from './pages/Users'
import Login from './pages/Login'
import './index.css'

function ProtectedRoute({ children, permission }) {
  const { currentUser, can } = useAuth()
  if (!currentUser) return <Navigate to="/login" replace />
  if (permission && !can(permission)) return <Navigate to="/" replace />
  return children
}

function AppShell() {
  const { currentUser } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!currentUser) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
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
            <Route path="/" element={<ProtectedRoute permission="dashboard"><Dashboard /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute permission="employees"><Employees /></ProtectedRoute>} />
            <Route path="/leave-types" element={<ProtectedRoute permission="leaveTypes"><LeaveTypes /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute permission="users"><Users /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <AppShell />
        </HashRouter>
      </AppProvider>
    </AuthProvider>
  )
}
