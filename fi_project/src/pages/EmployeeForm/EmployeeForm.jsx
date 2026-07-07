import React, { useState, useEffect } from 'react';
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
    status: 'Active'
  });

  // Validation errors state
  const [errors, setErrors] = useState({});

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit trigger
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isEditMode) {
      updateEmployee(id, {
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
      addEmployee(newEmployee);
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

              {/* Job Role */}
              <Input
                label="Job Role"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                error={errors.role}
                placeholder="Senior Frontend Developer"
                required
              />

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
