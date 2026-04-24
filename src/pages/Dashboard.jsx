import { useApp } from '../context/AppContext'
import { Users, CalendarDays, TrendingUp } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: color + '20' }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  )
}

function LeaveBar({ used, total, color }) {
  const pct = total === 0 ? 0 : Math.min(100, Math.round((used / total) * 100))
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
      <div
        className="h-1.5 rounded-full transition-all"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}

export default function Dashboard() {
  const { employees, leaveTypes } = useApp()

  const totalDaysUsed = employees.reduce((sum, emp) =>
    sum + (emp.allocations?.reduce((s, a) => s + a.daysUsed, 0) || 0), 0)

  const totalDaysAllocated = employees.reduce((sum, emp) =>
    sum + (emp.allocations?.reduce((s, a) => s + a.daysAllocated, 0) || 0), 0)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of leave across all employees</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard icon={Users} label="Total Employees" value={employees.length} color="#3b82f6" />
        <StatCard icon={CalendarDays} label="Leave Types" value={leaveTypes.length} color="#8b5cf6" />
        <StatCard icon={TrendingUp} label="Days Used / Allocated" value={`${totalDaysUsed} / ${totalDaysAllocated}`} color="#10b981" />
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          No employees yet. Go to <span className="font-medium">Employees</span> to add some.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {employees.map(emp => (
            <div key={emp.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {emp.firstName[0]}{emp.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{emp.firstName} {emp.lastName}</p>
                  <p className="text-xs text-slate-400">{emp.allocations?.length || 0} leave type{emp.allocations?.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {emp.allocations?.length === 0 && (
                <p className="text-sm text-slate-400">No leave allocated.</p>
              )}

              <div className="space-y-3">
                {emp.allocations?.map(alloc => {
                  const lt = leaveTypes.find(l => l.id === alloc.leaveTypeId)
                  if (!lt) return null
                  const remaining = alloc.daysAllocated - alloc.daysUsed
                  return (
                    <div key={alloc.leaveTypeId}>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lt.color }} />
                          <span className="text-slate-600">{lt.name}</span>
                        </div>
                        <span className="text-slate-500">
                          <span className="font-medium text-slate-800">{remaining}</span> / {alloc.daysAllocated} days left
                        </span>
                      </div>
                      <LeaveBar used={alloc.daysUsed} total={alloc.daysAllocated} color={lt.color} />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
