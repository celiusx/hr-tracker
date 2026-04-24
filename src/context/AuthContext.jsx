import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const DEFAULT_ADMIN = {
  id: 'admin-default',
  username: 'admin',
  password: 'admin123',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  employeeId: null,
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const ROLE_COLORS = {
  admin: 'bg-purple-100 text-purple-700',
  hr: 'bg-blue-100 text-blue-700',
  manager: 'bg-green-100 text-green-700',
  employee: 'bg-slate-100 text-slate-600',
}

export const ROLES = ['admin', 'hr', 'manager', 'employee']

export const PERMISSIONS = {
  admin: ['dashboard', 'employees', 'leaveTypes', 'users'],
  hr: ['dashboard', 'employees', 'leaveTypes'],
  manager: ['dashboard', 'employees'],
  employee: ['dashboard'],
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const stored = load('users', [DEFAULT_ADMIN])
    const hasAdmin = stored.some(u => u.id === DEFAULT_ADMIN.id)
    return hasAdmin ? stored : [DEFAULT_ADMIN, ...stored]
  })
  const [currentUser, setCurrentUser] = useState(() => load('currentUser', null))

  function saveUsers(updated) {
    setUsers(updated)
    localStorage.setItem('users', JSON.stringify(updated))
  }

  function login(username, password) {
    const user = users.find(u => u.username === username && u.password === password)
    if (!user) return false
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
    return true
  }

  function logout() {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
  }

  function addUser(user) {
    const newUser = { ...user, id: crypto.randomUUID() }
    saveUsers([...users, newUser])
  }

  function updateUser(updated) {
    const next = users.map(u => u.id === updated.id ? updated : u)
    saveUsers(next)
    if (currentUser?.id === updated.id) {
      setCurrentUser(updated)
      localStorage.setItem('currentUser', JSON.stringify(updated))
    }
  }

  function deleteUser(id) {
    saveUsers(users.filter(u => u.id !== id))
  }

  function can(permission) {
    if (!currentUser) return false
    return PERMISSIONS[currentUser.role]?.includes(permission) ?? false
  }

  return (
    <AuthContext.Provider value={{ currentUser, users, login, logout, addUser, updateUser, deleteUser, can }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
