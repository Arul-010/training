import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '../../context/EmployeeContext';
import { DEPARTMENTS } from '../../utils/mockData';
import { generateEmployeeId } from '../../utils/helpers';
import { FiSave, FiX, FiArrowLeft } from 'react-icons/fi';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import SelectInput from '../../components/UI/SelectInput';
import LoadingState from '../../components/Common/LoadingState';
import './EmployeeForm.css';

const PRESET_ROLES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Lead Developer',
  'Frontend Engineer',
  'Backend Developer',
  'Fullstack Developer',
  'Product Manager',
  'UX Designer',
  'UI/UX Researcher',
  'QA Specialist',
  'HR Specialist',
  'HR Manager',
  'System Administrator',
  'Data Scientist',
  'DevOps Engineer',
  'Marketing Specialist',
  'Finance Controller',
  'Business Analyst',
  'Project Manager',
  'Office Administrator'
];

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees, addEmployee, updateEmployee, loading } = useEmployees();

  const isEditMode = !!id;

  // Form input states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    salary: '',
    joinDate: '',
    dob: '',
    status: 'Active'
  });

  // Validation errors state
  const [errors, setErrors] = useState({});

  // Role searchable dropdown state
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const roleDropdownRef = useRef(null);

  // Dismiss role dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target)) {
        setShowRoleDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // If in edit mode, pull details and prefill
  useEffect(() => {
    if (isEditMode) {
      const emp = employees.find((e) => e.id === id);
      if (emp) {
        setFormData({
          name: emp.name || '',
          email: emp.email || '',
          phone: emp.phone || '',
          department: emp.department || '',
          role: emp.role || '',
          salary: emp.salary || '',
          joinDate: emp.joinDate || '',
          dob: emp.dob || '',
          status: emp.status || 'Active'
        });
      } else {
        // Redirect to add employee if ID is invalid
        navigate('/employees/new');
      }
    }
  }, [id, isEditMode, employees, navigate]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear matching validation errors when typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Field validation rules
  const validateForm = () => {
    const newErrors = {};

    // 1. Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }

    // 2. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    // 3. Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    // 4. Department validation
    if (!formData.department) {
      newErrors.department = 'Please select a department';
    }

    // 5. Role validation
    if (!formData.role.trim()) {
      newErrors.role = 'Job role is required';
    }

    // 6. Salary validation
    if (!formData.salary) {
      newErrors.salary = 'Salary amount is required';
    } else if (isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      newErrors.salary = 'Enter a positive salary number';
    }

    // 7. Join Date validation
    if (!formData.joinDate) {
      newErrors.joinDate = 'Hire join date is required';
    }

    // 8. Date of Birth validation
    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required';
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.dob = 'Employee must be at least 18 years old';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit trigger
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isEditMode) {
      await updateEmployee(id, {
        ...formData,
        salary: Number(formData.salary)
      });
      navigate(`/employees/${id}`);
    } else {
      const newEmployee = {
        ...formData,
        id: generateEmployeeId(),
        salary: Number(formData.salary),
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${formData.name}`
      };
      await addEmployee(newEmployee);
      navigate('/employees');
    }
  };

  return (
    <div className="employee-form-page">
      {/* Back shortcut */}
      <div className="form-header-actions">
        <Button
          variant="secondary"
          icon={FiArrowLeft}
          onClick={() => navigate(isEditMode ? `/employees/${id}` : '/employees')}
        >
          Cancel
        </Button>
      </div>

      {loading && <LoadingState message="Saving profile changes..." />}

      {!loading && (
        <div className="card form-container-card fade-in">
          <h2 className="form-title">
            {isEditMode ? 'Modify Employee Profile' : 'Register New Employee'}
          </h2>
          <p className="form-subtitle">
            Provide the required details below to manage employee database records.
          </p>

          <form onSubmit={handleSubmit} className="roster-form">
            <div className="form-fields-grid">
              {/* Full Name */}
              <Input
                label="Full Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Jane Doe"
                required
              />

              {/* Email Address */}
              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="jane.doe@company.com"
                required
              />

              {/* Phone Number */}
              <Input
                label="Phone Number"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="+1 (555) 019-2834"
                required
              />

              {/* Department */}
              <SelectInput
                label="Department"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                error={errors.department}
                required
              >
                <option value="">-- Choose Department --</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </SelectInput>

              {/* Job Role — Searchable Dropdown */}
              <div className="searchable-role-container" ref={roleDropdownRef} style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-body)', marginBottom: '8px' }}>
                  Job Role <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    className={`search-box-input${errors.role ? ' has-error' : ''}`}
                    value={formData.role}
                    onChange={(e) => {
                      handleChange(e);
                      setShowRoleDropdown(true);
                    }}
                    onFocus={() => setShowRoleDropdown(true)}
                    placeholder="Search or type a job role..."
                    autoComplete="off"
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      border: `1px solid ${errors.role ? 'var(--color-danger)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--border-radius-sm)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-title)',
                      fontSize: '0.925rem',
                      outline: 'none',
                      transition: 'border var(--transition-fast)',
                      boxSizing: 'border-box'
                    }}
                  />
                  {formData.role && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, role: '' }));
                        if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
                        setShowRoleDropdown(true);
                      }}
                      style={{
                        position: 'absolute', right: '12px', top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none', border: 'none',
                        color: 'var(--text-light)', cursor: 'pointer',
                        fontSize: '1.1rem', lineHeight: 1, padding: '4px'
                      }}
                      title="Clear selection"
                    >×</button>
                  )}
                </div>
                {errors.role && (
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-danger)', marginTop: '4px' }}>
                    {errors.role}
                  </span>
                )}

                {showRoleDropdown && (
                  <ul className="searchable-role-dropdown" style={{
                    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 50,
                    maxHeight: '220px',
                    overflowY: 'auto',
                    padding: '6px 0',
                    listStyle: 'none',
                    margin: 0
                  }}>
                    {PRESET_ROLES
                      .filter(r => r.toLowerCase().includes((formData.role || '').toLowerCase()))
                      .length > 0 ? (
                        PRESET_ROLES
                          .filter(r => r.toLowerCase().includes((formData.role || '').toLowerCase()))
                          .map(r => (
                            <li
                              key={r}
                              className="role-dropdown-item"
                              onMouseDown={(e) => {
                                e.preventDefault(); // prevent blur before click
                                setFormData(prev => ({ ...prev, role: r }));
                                setShowRoleDropdown(false);
                                if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
                              }}
                              style={{
                                padding: '10px 16px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                borderRadius: '4px',
                                margin: '0 6px',
                                transition: 'background var(--transition-fast)'
                              }}
                            >
                              {r}
                            </li>
                          ))
                      ) : (
                        <li style={{
                          padding: '10px 16px',
                          fontSize: '0.85rem',
                          color: 'var(--text-light)',
                          fontStyle: 'italic'
                        }}>
                          No presets match — press Enter to use "{formData.role}"
                        </li>
                      )
                    }
                  </ul>
                )}
              </div>

              {/* Salary */}
              <Input
                label="Annual Salary ($)"
                id="salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                error={errors.salary}
                placeholder="115000"
                required
              />

              {/* Join Date */}
              <Input
                label="Join Date"
                id="joinDate"
                name="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={handleChange}
                error={errors.joinDate}
                required
              />

              {/* Date of Birth */}
              <Input
                label="Date of Birth (D.O.B)"
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                error={errors.dob}
                required
              />

              {/* Employment Status - Only visible in Edit Mode */}
              {isEditMode && (
                <SelectInput
                  label="Employment Status"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </SelectInput>
              )}
            </div>

            <div className="form-submit-panel">
              <Button
                variant="secondary"
                icon={FiX}
                onClick={() => navigate(isEditMode ? `/employees/${id}` : '/employees')}
              >
                Discard
              </Button>
              <Button variant="primary" type="submit" icon={FiSave}>
                {isEditMode ? 'Update Profile' : 'Add Employee'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployeeForm;
