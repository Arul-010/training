import React, { useState } from 'react';
import { useEmployees } from '../../context/EmployeeContext';
import { DEPARTMENTS } from '../../utils/mockData';
import { formatCurrency, formatDate, getAvatarUrl } from '../../utils/helpers';
import { FiSearch, FiEdit2, FiTrash2, FiEye, FiUserPlus } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/UI/Button';
import EmptyState from '../../components/Common/EmptyState';
import LoadingState from '../../components/Common/LoadingState';
import StatusBadge from '../../components/UI/StatusBadge';
import './EmployeeList.css';

const EmployeeList = () => {
  const { employees, deleteEmployee, showConfirmation, loading } = useEmployees();
  const navigate = useNavigate();

  // Filter & Search local states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [sortBy, setSortBy] = useState('name-asc'); // name-asc | name-desc | salary-desc | salary-asc | date-desc

  // Delete click handler
  const handleDeleteClick = (id, name) => {
    showConfirmation(
      `Are you sure you want to permanently delete employee ${name}? This action cannot be undone.`,
      () => deleteEmployee(id)
    );
  };

  // Perform filtering, searching, and sorting
  const filteredEmployees = employees
    .filter((emp) => {
      if (!emp) return false;
      // 1. Search term check defensively
      const query = searchTerm.toLowerCase();
      const name = emp.name ? String(emp.name).toLowerCase() : '';
      const email = emp.email ? String(emp.email).toLowerCase() : '';
      const designation = emp.designation ? String(emp.designation).toLowerCase() : '';
      const department = emp.department ? String(emp.department).toLowerCase() : '';
      const id = emp.id ? String(emp.id).toLowerCase() : '';

      const matchesSearch =
        name.includes(query) ||
        email.includes(query) ||
        designation.includes(query) ||
        department.includes(query) ||
        id.includes(query);

      // 2. Department check
      const matchesDept = selectedDept === '' || emp.department === selectedDept;

      return matchesSearch && matchesDept;
    })
    .sort((a, b) => {
      // 3. Sorting checks
      switch (sortBy) {
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'salary-desc':
          return Number(b.salary || 0) - Number(a.salary || 0);
        case 'salary-asc':
          return Number(a.salary || 0) - Number(b.salary || 0);
        case 'date-desc':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });


  return (
    <div className="employee-list-page">
      {/* Search and Filters panel */}
      <section className="card filter-bar-card">
        <div className="filters-wrapper">
          {/* Search Field */}
          <div className="search-field-box">
            <FiSearch className="search-box-icon" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-box-input"
            />
          </div>

          {/* Department dropdown */}
          <div className="select-dropdown-box">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="select-control-box"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="select-dropdown-box">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-control-box"
            >
              <option value="name-asc">Name (A - Z)</option>
              <option value="name-desc">Name (Z - A)</option>
              <option value="salary-desc">Salary (High to Low)</option>
              <option value="salary-asc">Salary (Low to High)</option>
              <option value="date-desc">Newest Hires</option>
            </select>
          </div>

          {/* Add Staff Shortcut Button */}
          <Button
            variant="primary"
            icon={FiUserPlus}
            onClick={() => navigate('/employees/new')}
            className="add-staff-btn-desktop"
          >
            Add Employee
          </Button>
        </div>
      </section>

      {/* Render Loader Overlay during transactions */}
      {loading && <LoadingState message="Processing system files..." />}

      {/* Data display grids */}
      {!loading && (
        <>
          {filteredEmployees.length === 0 ? (
            <EmptyState
              title={employees.length === 0 ? "No Employees Registered" : "No Matches Found"}
              description={
                employees.length === 0
                  ? "Get started by adding your first team member to the database."
                  : "We couldn't find any employees matching your search query or filters."
              }
              iconType={employees.length === 0 ? "users" : "search"}
              actionLabel={employees.length === 0 ? "Register Employee" : "Clear Filters"}
              onActionClick={
                employees.length === 0
                  ? () => navigate('/employees/new')
                  : () => {
                      setSearchTerm('');
                      setSelectedDept('');
                      setSortBy('name-asc');
                    }
              }
            />
          ) : (
            <>
              {/* Desktop Roster Table */}
              <div className="table-responsive-desktop">
                <table className="roster-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Status</th>
                      <th>Salary</th>
                      <th>Join Date</th>
                      <th className="align-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="roster-row">
                        <td>
                          <div className="employee-info-cell">
                            <img
                              src={getAvatarUrl(emp.name, emp.avatar)}
                              alt={emp.name}
                              className="roster-avatar"
                            />
                            <div className="name-email-box">
                              <span className="roster-name">{emp.name}</span>
                              <span className="roster-id">{emp.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="dept-badge">{emp.department}</span>
                        </td>
                        <td className="roster-role">{emp.designation}</td>
                        <td>
                          <StatusBadge status={emp.status} />
                        </td>
                        <td className="roster-salary">{formatCurrency(emp.salary)}</td>
                        <td className="roster-date">{formatDate(emp.joinDate)}</td>
                        <td>
                          <div className="roster-actions">
                            <Link
                              to={`/employees/${emp.id}`}
                              className="action-link-btn view"
                              title="View Details"
                            >
                              <FiEye />
                            </Link>
                            <Link
                              to={`/employees/edit/${emp.id}`}
                              className="action-link-btn edit"
                              title="Edit Details"
                            >
                              <FiEdit2 />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(emp.id, emp.name)}
                              className="action-link-btn delete"
                              title="Delete Record"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Adaptive Card Grid */}
              <div className="mobile-card-grid">
                {filteredEmployees.map((emp) => (
                  <div key={emp.id} className="card mobile-roster-card fade-in">
                    <div className="mobile-card-top">
                      <div className="mobile-card-info">
                        <img
                          src={getAvatarUrl(emp.name, emp.avatar)}
                          alt={emp.name}
                          className="roster-avatar"
                        />
                        <div>
                          <h3 className="mobile-card-name">{emp.name}</h3>
                          <span className="mobile-card-id">{emp.id}</span>
                        </div>
                      </div>
                      <StatusBadge status={emp.status} />
                    </div>

                    <div className="mobile-card-details">
                      <div className="mobile-detail-row">
                        <span className="mobile-detail-label">Dept / Designation:</span>
                        <span className="mobile-detail-val">
                          {emp.department} • {emp.designation}
                        </span>
                      </div>
                      <div className="mobile-detail-row">
                        <span className="mobile-detail-label">Salary:</span>
                        <span className="mobile-detail-val roster-salary">
                          {formatCurrency(emp.salary)}
                        </span>
                      </div>
                      <div className="mobile-detail-row">
                        <span className="mobile-detail-label">Join Date:</span>
                        <span className="mobile-detail-val">
                          {formatDate(emp.joinDate)}
                        </span>
                      </div>
                    </div>

                    <div className="mobile-card-actions">
                      <Link
                        to={`/employees/${emp.id}`}
                        className="mobile-action-btn view"
                      >
                        <FiEye /> Details
                      </Link>
                      <Link
                        to={`/employees/edit/${emp.id}`}
                        className="mobile-action-btn edit"
                      >
                        <FiEdit2 /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(emp.id, emp.name)}
                        className="mobile-action-btn delete"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeList;
