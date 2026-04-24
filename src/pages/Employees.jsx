import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'

function EmployeeForm({ initial, onSave, onClose }) {
  const { leaveTypes } = useApp()
  const [firstName, setFirstName] = useState(initial?.firstName || '')
  const [lastName, setLastName] = useState(initial?.lastName || '')
  const [allocations, setAllocations] = useState(() => {
    if (initial?.allocations) return initial.allocations
    return leaveTypes.map(lt => ({ leaveTypeId: lt.id, daysAllocated: lt.daysPerYear, daysUsed: 0 }))
  })

  function toggleLeaveType(lt) {
    const exists = allocations.find(a => a.leaveTypeId === lt.id)
    if (exists) {
      setAllocations(allocations.filter(a => a.leaveTypeId !== lt.id))
    } else {
      setAllocations([...allocations, { leaveTypeId: lt.id, daysAllocated: lt.daysPerYear, daysUsed: 0 }])
    }
  }

  function updateDays(leaveTypeId, field, value) {
    setAllocations(allocations.map(a =>
      a.leaveTypeId === leaveTypeId ? { ...a, [field]: Math.max(0, Number(value)) } : a
    ))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) return
    onSave({ ...initial, firstName: firstName.trim(), lastName: lastName.trim(), allocations })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
          <input
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder="John"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
          <input
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            placeholder="Doe"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Leave Allocations</label>
        {leaveTypes.length === 0 && (
          <p className="text-sm text-slate-400">No leave types defined yet.</p>
        )}
        <div className="space-y-2">
          {leaveTypes.map(lt => {
            const alloc = allocations.find(a => a.leaveTypeId === lt.id)
            const enabled = !!alloc
            return (
              <div key={lt.id} className={`border rounded-lg p-3 transition-colors ${enabled ? 'border-blue-200 bg-blue-50/50' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => toggleLeaveType(lt)}
                    className="rounded"
                  />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lt.color }} />
                  <span className="text-sm font-medium text-slate-700">{lt.name}</span>
                </div>
                {enabled && (
                  <div className="grid grid-cols-2 gap-2 pl-6">
                    <div>
                      <label className="text-xs text-slate-500">Days Allocated</label>
                      <input
                        type="number"
                        min="0"
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm mt-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={alloc.daysAllocated}
                        onChange={e => updateDays(lt.id, 'daysAllocated', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Days Used</label>
                      <input
                        type="number"
                        min="0"
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm mt-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={alloc.daysUsed}
                        onChange={e => updateDays(lt.id, 'daysUsed', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
      </div>
    </form>
  )
}

export default function Employees() {
  const { employees, leaveTypes, addEmployee, updateEmployee, deleteEmployee } = useApp()
  const { can } = useAuth()
  const [modal, setModal] = useState(null)
  const canEdit = can('employees') && !['manager'].includes(useAuth().currentUser?.role)

  function handleSave(data) {
    if (modal === 'add') addEmployee(data)
    else updateEmployee(data)
    setModal(null)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Employees</h1>
          <p className="text-sm text-slate-500 mt-1">
            {canEdit ? 'Manage employee profiles and leave allocations' : 'View employee leave allocations'}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setModal('add')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} /> Add Employee
          </button>
        )}
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No employees yet. Add one to get started.</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-slate-600">Employee</th>
                {leaveTypes.map(lt => (
                  <th key={lt.id} className="text-center px-3 py-3 font-medium text-slate-600">{lt.name}</th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <span className="font-medium text-slate-800">{emp.firstName} {emp.lastName}</span>
                    </div>
                  </td>
                  {leaveTypes.map(lt => {
                    const alloc = emp.allocations?.find(a => a.leaveTypeId === lt.id)
                    return (
                      <td key={lt.id} className="px-3 py-3 text-center">
                        {alloc ? (
                          <span className="text-slate-700">
                            <span className="font-medium">{alloc.daysAllocated - alloc.daysUsed}</span>
                            <span className="text-slate-400">/{alloc.daysAllocated}</span>
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    )
                  })}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {canEdit && (<>
                        <button onClick={() => setModal(emp)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => deleteEmployee(emp.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </>)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal
          title={modal === 'add' ? 'Add Employee' : `Edit ${modal.firstName} ${modal.lastName}`}
          onClose={() => setModal(null)}
        >
          <EmployeeForm initial={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
