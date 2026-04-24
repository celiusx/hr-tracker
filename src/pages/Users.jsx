import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useAuth, ROLES, ROLE_COLORS } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import Modal from '../components/Modal'

function UserForm({ initial, onSave, onClose }) {
  const { users } = useAuth()
  const { employees } = useApp()
  const [firstName, setFirstName] = useState(initial?.firstName || '')
  const [lastName, setLastName] = useState(initial?.lastName || '')
  const [username, setUsername] = useState(initial?.username || '')
  const [email, setEmail] = useState(initial?.email || '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(initial?.role || 'employee')
  const [employeeId, setEmployeeId] = useState(initial?.employeeId || '')
  const [usernameError, setUsernameError] = useState('')
  const [emailError, setEmailError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const dupUsername = users.find(u => u.username === username.trim() && u.id !== initial?.id)
    if (dupUsername) { setUsernameError('Username already taken'); return }
    const dupEmail = users.find(u => u.email === email.trim().toLowerCase() && u.id !== initial?.id)
    if (dupEmail) { setEmailError('Email already in use'); return }
    if (!initial && !password) return
    onSave({
      ...initial,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password || initial?.password,
      role,
      employeeId: employeeId || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
          <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
          <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
        <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username} onChange={e => { setUsername(e.target.value); setUsernameError('') }} placeholder="johndoe" required />
        {usernameError && <p className="text-xs text-red-500 mt-1">{usernameError}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input type="email" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email} onChange={e => { setEmail(e.target.value); setEmailError('') }} placeholder="john@example.com" required />
        {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Password {initial && <span className="text-slate-400 font-normal">(leave blank to keep current)</span>}
        </label>
        <input type="password" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password} onChange={e => setPassword(e.target.value)} placeholder={initial ? '••••••••' : 'Set password'}
          required={!initial} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
        <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={role} onChange={e => setRole(e.target.value)}>
          {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </select>
      </div>
      {role === 'employee' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Link to Employee Record <span className="text-slate-400 font-normal">(optional)</span></label>
          <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={employeeId} onChange={e => setEmployeeId(e.target.value)}>
            <option value="">— None —</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
            ))}
          </select>
        </div>
      )}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:text-slate-900">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
      </div>
    </form>
  )
}

export default function Users() {
  const { users, currentUser, addUser, updateUser, deleteUser } = useAuth()
  const [modal, setModal] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  function handleSave(data) {
    if (modal === 'add') addUser(data)
    else updateUser(data)
    setModal(null)
  }

  function handleDelete() {
    deleteUser(confirmDelete.id)
    setConfirmDelete(null)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Users</h1>
          <p className="text-sm text-slate-500 mt-1">Manage user accounts and roles</p>
        </div>
        <button onClick={() => setModal('add')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-slate-600">Name</th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">Username</th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">Email</th>
              <th className="text-left px-5 py-3 font-medium text-slate-600">Role</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <span className="font-medium text-slate-800">{user.firstName} {user.lastName}</span>
                    {user.id === currentUser?.id && (
                      <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">you</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600 font-mono text-xs">{user.username}</td>
                <td className="px-5 py-3 text-slate-600 text-xs">{user.email || <span className="text-slate-300">—</span>}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${ROLE_COLORS[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setModal(user)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setConfirmDelete(user)} className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add User' : `Edit ${modal.firstName} ${modal.lastName}`} onClose={() => setModal(null)}>
          <UserForm initial={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}

      {confirmDelete && (
        <Modal title="Delete User" onClose={() => setConfirmDelete(null)}>
          <p className="text-sm text-slate-600 mb-1">
            Are you sure you want to delete <span className="font-semibold text-slate-800">{confirmDelete.firstName} {confirmDelete.lastName}</span>?
          </p>
          {confirmDelete.id === currentUser?.id && (
            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
              Warning: you are deleting your own account. You will be signed out.
            </p>
          )}
          <div className="flex justify-end gap-2 mt-5">
            <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:text-slate-900">
              Cancel
            </button>
            <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700">
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
