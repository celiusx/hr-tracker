import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, CalendarDays } from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/leave-types', icon: CalendarDays, label: 'Leave Types' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col">
      <div className="px-6 py-5 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-800">HR Tracker</h1>
        <p className="text-xs text-slate-500 mt-0.5">Leave Management</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
