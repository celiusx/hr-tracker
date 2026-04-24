import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/leave-types', icon: CalendarDays, label: 'Leave Types' },
]

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
          fixed z-30 top-0 left-0 h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300
          lg:static lg:z-auto lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        {/* Header */}
        <div className={`border-b border-slate-200 flex items-center ${collapsed ? 'justify-center py-5 px-2' : 'px-5 py-5 justify-between'}`}>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-slate-800">HR Tracker</h1>
              <p className="text-xs text-slate-500 mt-0.5">Leave Management</p>
            </div>
          )}
          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
          {/* Desktop collapse toggle */}
          {collapsed ? (
            <button
              onClick={onToggle}
              className="hidden lg:flex items-center justify-center w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={onToggle}
              className="hidden lg:flex items-center justify-center w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onMobileClose}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
