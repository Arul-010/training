import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_EMPLOYEES } from '../utils/mockData';

const EmployeeContext = createContext();

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};

export const EmployeeProvider = ({ children }) => {
  // Load initial employees from Local Storage or fallback to mock data
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

  // Save employees to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('ems_employees', JSON.stringify(employees));
  }, [employees]);

  // Toast Helpers
  const triggerToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove toast after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Confirmation Modal Helpers
  const showConfirmation = (message, onConfirmCallback) => {
    setConfirmModal({
      isOpen: true,
      message,
      onConfirm: () => {
        onConfirmCallback();
        closeConfirmation();
      }
    });
  };

  const closeConfirmation = () => {
    setConfirmModal({
      isOpen: false,
      message: '',
      onConfirm: null
    });
  };

  // CRUD Actions
  const addEmployee = (employee) => {
    setLoading(true);
    // Simulate minor latency for a professional loading indicator feel
    setTimeout(() => {
      setEmployees((prev) => [employee, ...prev]);
      setLoading(false);
      triggerToast(`${employee.name} added successfully!`, 'success');
    }, 600);
  };

  const updateEmployee = (id, updatedEmployee) => {
    setLoading(true);
    setTimeout(() => {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === id ? { ...emp, ...updatedEmployee } : emp))
      );
      setLoading(false);
      triggerToast(`${updatedEmployee.name}'s details updated successfully!`, 'success');
    }, 600);
  };

  const deleteEmployee = (id) => {
    const employeeToDelete = employees.find((emp) => emp.id === id);
    const name = employeeToDelete ? employeeToDelete.name : 'Employee';
    
    setLoading(true);
    setTimeout(() => {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      setLoading(false);
      triggerToast(`${name} has been removed from the system.`, 'warning');
    }, 600);
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        toasts,
        confirmModal,
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
