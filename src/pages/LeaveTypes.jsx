import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Modal from '../components/Modal'

const COLORS = ['#3b82f6','#ef4444','#10b981','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#84cc16']

function LeaveTypeForm({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || '')
  const [daysPerYear, setDaysPerYear] = useState(initial?.daysPerYear || 10)
  const [color, setColor] = useState(initial?.color || COLORS[0])

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ ...initial, name: name.trim(), daysPerYear: Number(daysPerYear), color })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type Name</label>
        <input
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Annual Leave"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Days Per Year</label>
        <input
          type="number"
          min="1"
          max="365"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={daysPerYear}
          onChange={e => setDaysPerYear(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 transition-transform ${color === c ? 'border-slate-800 scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
      </div>
    </form>
  )
}

export default function LeaveTypes() {
  const { leaveTypes, addLeaveType, updateLeaveType, deleteLeaveType } = useApp()
  const [modal, setModal] = useState(null) // null | 'add' | leaveType object

  function handleSave(data) {
    if (modal === 'add') addLeaveType(data)
    else updateLeaveType(data)
    setModal(null)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Leave Types</h1>
          <p className="text-sm text-slate-500 mt-1">Define the types of leave available to employees</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Add Leave Type
        </button>
      </div>

      {leaveTypes.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No leave types yet. Add one to get started.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leaveTypes.map(lt => (
            <div key={lt.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: lt.color }}>
                  {lt.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{lt.name}</p>
                  <p className="text-sm text-slate-500">{lt.daysPerYear} days / year</p>
                </div>
              </div>
              <div className="flex justify-end gap-1 pt-2 border-t border-slate-100">
                <button onClick={() => setModal(lt)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => deleteLeaveType(lt.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Add Leave Type' : 'Edit Leave Type'} onClose={() => setModal(null)}>
          <LeaveTypeForm initial={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
