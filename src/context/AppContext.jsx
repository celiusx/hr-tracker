import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

const defaultLeaveTypes = [
  { id: '1', name: 'Annual Leave', daysPerYear: 15, color: '#3b82f6' },
  { id: '2', name: 'Sick Leave', daysPerYear: 10, color: '#ef4444' },
  { id: '3', name: 'Maternity/Paternity Leave', daysPerYear: 90, color: '#8b5cf6' },
]

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  const [leaveTypes, setLeaveTypes] = useState(() => load('leaveTypes', defaultLeaveTypes))
  const [employees, setEmployees] = useState(() => load('employees', []))

  useEffect(() => { localStorage.setItem('leaveTypes', JSON.stringify(leaveTypes)) }, [leaveTypes])
  useEffect(() => { localStorage.setItem('employees', JSON.stringify(employees)) }, [employees])

  function addLeaveType(lt) {
    setLeaveTypes(prev => [...prev, { ...lt, id: crypto.randomUUID() }])
  }
  function updateLeaveType(updated) {
    setLeaveTypes(prev => prev.map(lt => lt.id === updated.id ? updated : lt))
  }
  function deleteLeaveType(id) {
    setLeaveTypes(prev => prev.filter(lt => lt.id !== id))
    setEmployees(prev => prev.map(emp => ({
      ...emp,
      allocations: emp.allocations.filter(a => a.leaveTypeId !== id)
    })))
  }

  function addEmployee(emp) {
    setEmployees(prev => [...prev, { ...emp, id: crypto.randomUUID(), allocations: emp.allocations || [] }])
  }
  function updateEmployee(updated) {
    setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e))
  }
  function deleteEmployee(id) {
    setEmployees(prev => prev.filter(e => e.id !== id))
  }

  return (
    <AppContext.Provider value={{
      leaveTypes, addLeaveType, updateLeaveType, deleteLeaveType,
      employees, addEmployee, updateEmployee, deleteEmployee,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
