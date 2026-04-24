import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, CalendarDays, ChevronLeft, ChevronRight, X, LogOut, UserCog } from 'lucide-react'
import { useAuth, ROLE_COLORS, PERMISSIONS } from '../context/AuthContext'

const ALL_LINKS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', permission: 'dashboard' },
  { to: '/employees', icon: Users, label: 'Employees', permission: 'employees' },
  { to: '/leave-types', icon: CalendarDays, label: 'Leave Types', permission: 'leaveTypes' },
  { to: '/users', icon: UserCog, label: 'Users', permission: 'users' },
]

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { currentUser, logout, can } = useAuth()

  const links = ALL_LINKS.filter(l => can(l.permission))

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={onMobileClose} />
      )}

      <aside className={`
        fixed z-30 top-0 left-0 h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300
        lg:static lg:z-auto lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${collapsed ? 'w-16' : 'w-64'}
      `}>
        {/* Header */}
        <div className={`border-b border-slate-200 flex items-center ${collapsed ? 'justify-center py-5 px-2' : 'px-5 py-5 justify-between'}`}>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-slate-800">HR Tracker</h1>
              <p className="text-xs text-slate-500 mt-0.5">Leave Management</p>
            </div>
          )}
          <button onClick={onMobileClose} className="lg:hidden p-1 text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
          <button
            onClick={onToggle}
            className="hidden lg:flex items-center justify-center w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onMobileClose}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${collapsed ? 'justify-center' : ''} ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className={`border-t border-slate-200 p-3 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
          {!collapsed && currentUser && (
            <div className="flex items-center gap-2 px-2 py-1 mb-1">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs shrink-0">
                {currentUser.firstName[0]}{currentUser.lastName[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{currentUser.firstName} {currentUser.lastName}</p>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full capitalize ${ROLE_COLORS[currentUser.role]}`}>
                  {currentUser.role}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            title={collapsed ? 'Sign Out' : undefined}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </aside>
    </>
  )
}
