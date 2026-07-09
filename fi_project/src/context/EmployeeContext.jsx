import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { INITIAL_EMPLOYEES } from '../utils/mockData';

const EmployeeContext = createContext();

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};

// ─── Axios instance with base URL ────────────────────────────────────────────
const api = axios.create({
  baseURL: 'https://6a48e677a033dcb98d65067b.mockapi.io',
  headers: { 'Content-Type': 'application/json' }
});

export const EmployeeProvider = ({ children }) => {

  // Load initial employees from Local Storage or mockData while API loads
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('ems_employees');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse employees from localStorage', e);
        return INITIAL_EMPLOYEES;
      }
    }
    return INITIAL_EMPLOYEES;
  });

  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: '',
    onConfirm: null
  });

  // ─── Fetch employees from MockAPI ─────────────────────────────────────────
  const loadEmployeesFromAPI = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await api.get('/employees');
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map((emp, index) => {
          const cleanId = String(emp.id).startsWith('EMP-') ? emp.id : `EMP-${emp.id}`;
          let defaultStatus = 'Active';
          if (index % 6 === 0)  defaultStatus = 'On Leave';
          if (index % 11 === 0) defaultStatus = 'Terminated';
          return {
            ...emp,
            id: cleanId,
            status:      emp.status      || defaultStatus,
            designation: emp.designation || (index % 3 === 0 ? 'Senior Engineer' : index % 3 === 1 ? 'UX Designer' : 'HR Specialist'),
            phone:       emp.phone       || `+91 98765 4321${index % 10}`,
            salary:      emp.salary      || (65000 + (index % 5) * 15000),
            joinDate:    emp.joinDate    || `2024-0${1 + (index % 9)}-12`,
            avatar:      emp.avatar      || `/user-img.webp`
          };
        });
        setEmployees(formatted);
      }
    } catch (err) {
      console.error('Error fetching employees from MockAPI, using fallback data:', err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch with spinner
    loadEmployeesFromAPI(false);

    // Silent background sync every 10 seconds
    const interval = setInterval(() => loadEmployeesFromAPI(true), 10000);
    return () => clearInterval(interval);
  }, []);

  // ─── Authentication State ─────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ems_current_user');
    if (saved) {
      try { return JSON.parse(saved); }
      catch (e) { return null; }
    }
    return null;
  });

  // ─── Queries State ────────────────────────────────────────────────────────
  const [queries, setQueries] = useState(() => {
    const saved = localStorage.getItem('ems_queries');
    if (saved) {
      try { return JSON.parse(saved); }
      catch (e) { return []; }
    }
    return [
      {
        id: 'q1',
        employeeId: 'EMP-1002',
        employeeName: 'Sarah Jenkins',
        subject: 'Leave Approval Request',
        message: 'Requesting approval for 3 days of leave from July 15th to July 18th for medical checkup.',
        date: '2026-07-07',
        status: 'Pending'
      },
      {
        id: 'q2',
        employeeId: 'EMP-1003',
        employeeName: 'Michael Chen',
        subject: 'IT Hardware Upgrade',
        message: 'Requesting a secondary monitor for developer productivity.',
        date: '2026-07-08',
        status: 'Resolved'
      }
    ];
  });

  // ─── Leave Applications State ─────────────────────────────────────────────
  const [leaveApplications, setLeaveApplications] = useState(() => {
    const saved = localStorage.getItem('ems_leave_applications');
    if (saved) {
      try { return JSON.parse(saved); }
      catch (e) { return []; }
    }
    // Seed data
    return [
      {
        id: 'lv1',
        employeeId: 'EMP-1002',
        employeeName: 'Sarah Jenkins',
        reason: 'Medical checkup and recovery.',
        startDate: '2026-07-15',
        endDate: '2026-07-18',
        requestedDays: 3,
        approvedDays: null,
        status: 'Pending',
        appliedOn: '2026-07-07',
        adminNote: ''
      }
    ];
  });

  // ─── Persist to localStorage ──────────────────────────────────────────────
  useEffect(() => { localStorage.setItem('ems_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('ems_current_user', JSON.stringify(currentUser));
    else             localStorage.removeItem('ems_current_user');
  }, [currentUser]);
  useEffect(() => { localStorage.setItem('ems_queries', JSON.stringify(queries)); }, [queries]);
  useEffect(() => { localStorage.setItem('ems_leave_applications', JSON.stringify(leaveApplications)); }, [leaveApplications]);

  // ─── Toast Helpers ────────────────────────────────────────────────────────
  const triggerToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  // ─── Confirmation Modal ───────────────────────────────────────────────────
  const showConfirmation = (message, onConfirmCallback) => {
    setConfirmModal({
      isOpen: true, message,
      onConfirm: () => { onConfirmCallback(); closeConfirmation(); }
    });
  };
  const closeConfirmation = () => setConfirmModal({ isOpen: false, message: '', onConfirm: null });

  // ─── Authentication actions ───────────────────────────────────────────────
  const login = (role, identifier = '') => {
    setLoading(true);
    setTimeout(() => {
      if (role === 'admin') {
        setCurrentUser({ role: 'admin', name: 'Admin User' });
        triggerToast('Welcome back, Admin!', 'success');
      } else {
        const idLower = identifier.toLowerCase();
        let emp = employees.find(e =>
          e.id.toLowerCase() === idLower || e.name.toLowerCase() === idLower
        );
        if (!emp) emp = employees.find(e => e.name.toLowerCase().includes(idLower));
        if (!emp && employees.length > 0) {
          emp = employees[0];
          triggerToast(`Profile "${identifier}" not found. Initialized session as ${emp.name}.`, 'info');
        }
        if (emp) {
          setCurrentUser({ role: 'employee', employeeId: emp.id, name: emp.name });
          triggerToast(`Welcome back, ${emp.name}!`, 'success');
        } else {
          setCurrentUser({ role: 'employee', employeeId: 'EMP-1001', name: 'Arul Selvam' });
          triggerToast('Welcome back, Arul Selvam!', 'success');
        }
      }
      setLoading(false);
    }, 400);
  };

  const logout = () => {
    setCurrentUser(null);
    triggerToast('Logged out successfully.', 'info');
  };

  // ─── Queries actions ──────────────────────────────────────────────────────
  const addQuery = (employeeId, subject, message) => {
    const emp = employees.find(e => e.id === employeeId);
    const newQuery = {
      id: 'q-' + Date.now() + Math.random().toString(36).substr(2, 5),
      employeeId,
      employeeName: emp ? emp.name : 'Unknown Employee',
      subject: subject.trim(),
      message: message.trim(),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setQueries(prev => [newQuery, ...prev]);
    triggerToast('Query submitted to Admin successfully!', 'success');
  };

  const resolveQuery = (id) => {
    setQueries(prev => prev.map(q => q.id === id ? { ...q, status: 'Resolved' } : q));
    triggerToast('Query marked as resolved!', 'success');
  };

  // ─── Leave Application actions ────────────────────────────────────────────
  const applyLeave = (employeeId, { reason, startDate, endDate, requestedDays }) => {
    const emp = employees.find(e => e.id === employeeId);
    const newApp = {
      id: 'lv-' + Date.now() + Math.random().toString(36).substr(2, 5),
      employeeId,
      employeeName: emp ? emp.name : 'Unknown Employee',
      reason: reason.trim(),
      startDate,
      endDate,
      requestedDays,
      approvedDays: null,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
      adminNote: ''
    };
    setLeaveApplications(prev => [newApp, ...prev]);
    triggerToast('Leave application submitted successfully!', 'success');
  };

  // Admin: update approved days, status, or admin note on a leave application
  const updateLeaveApplication = (id, changes) => {
    setLeaveApplications(prev =>
      prev.map(lv => lv.id === id ? { ...lv, ...changes } : lv)
    );
    triggerToast('Leave application updated!', 'success');
  };

  // ─── CRUD — POST (Add Employee) ───────────────────────────────────────────
  const addEmployee = async (employee) => {
    setLoading(true);
    try {
      const { data: newEmp } = await api.post('/employees', employee);
      const formatted = {
        ...newEmp,
        id: String(newEmp.id).startsWith('EMP-') ? newEmp.id : `EMP-${newEmp.id}`
      };
      setEmployees(prev => [formatted, ...prev]);
      triggerToast(`${formatted.name} added successfully!`, 'success');
    } catch (err) {
      console.error('Failed to add employee via MockAPI. Saving locally...', err.message);
      const fallbackEmp = { ...employee, id: `EMP-${Date.now().toString().slice(-4)}` };
      setEmployees(prev => [fallbackEmp, ...prev]);
      triggerToast(`${employee.name} added locally (API fallback).`, 'success');
    } finally {
      setLoading(false);
    }
  };

  // ─── CRUD — PUT (Update Employee) ─────────────────────────────────────────
  const updateEmployee = async (id, updatedEmployee) => {
    setLoading(true);
    const apiId = id.replace('EMP-', '');
    try {
      await api.put(`/employees/${apiId}`, updatedEmployee);
      setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...updatedEmployee } : emp));
      triggerToast(`${updatedEmployee.name}'s details updated successfully!`, 'success');
    } catch (err) {
      console.error('Failed to update employee via MockAPI. Saving locally...', err.message);
      setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...updatedEmployee } : emp));
      triggerToast(`${updatedEmployee.name}'s details updated locally (API fallback).`, 'success');
    } finally {
      setLoading(false);
    }
  };

  // ─── CRUD — DELETE (Remove Employee) ─────────────────────────────────────
  const deleteEmployee = async (id) => {
    const name = employees.find(emp => emp.id === id)?.name || 'Employee';
    setLoading(true);
    const apiId = id.replace('EMP-', '');
    try {
      await api.delete(`/employees/${apiId}`);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      triggerToast(`${name} has been removed from the system.`, 'warning');
    } catch (err) {
      console.error('Failed to delete employee via MockAPI. Deleting locally...', err.message);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      triggerToast(`${name} removed locally (API fallback).`, 'warning');
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        toasts,
        confirmModal,
        currentUser,
        queries,
        leaveApplications,
        login,
        logout,
        addQuery,
        resolveQuery,
        applyLeave,
        updateLeaveApplication,
        triggerToast,
        removeToast,
        showConfirmation,
        closeConfirmation,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        setLoading
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
