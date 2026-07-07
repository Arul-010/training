import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEmployees } from '../../context/EmployeeContext';
import { formatCurrency, formatDate, getAvatarUrl } from '../../utils/helpers';
import { FiArrowLeft, FiEdit2, FiTrash2, FiMail, FiPhone, FiDollarSign, FiCalendar, FiBriefcase } from 'react-icons/fi';
import Button from '../../components/UI/Button';
import LoadingState from '../../components/Common/LoadingState';
import StatusBadge from '../../components/UI/StatusBadge';
import './EmployeeDetails.css';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees, deleteEmployee, showConfirmation, loading } = useEmployees();

  // Find matching employee record
  const employee = employees.find((emp) => emp.id === id);

  // If no matching employee, redirect to NotFound (or show error and back action)
  if (!employee) {
    return (
      <div className="card details-not-found-card fade-in">
        <h3 className="not-found-title">Employee Profile Not Found</h3>
        <p className="not-found-desc">
          The employee record with ID <strong>{id}</strong> could not be located in the database.
        </p>
        <Button variant="primary" icon={FiArrowLeft} onClick={() => navigate('/employees')}>
          Back to Roster
        </Button>
      </div>
    );
  }

  // Delete click handler
  const handleDeleteClick = () => {
    showConfirmation(
      `Are you sure you want to permanently delete employee ${employee.name}? This action cannot be undone.`,
      () => {
        deleteEmployee(employee.id);
        navigate('/employees');
      }
    );
  };


  return (
    <div className="employee-details-page">
      {/* Back button shortcut */}
      <div className="details-header-actions">
        <Button variant="secondary" icon={FiArrowLeft} onClick={() => navigate('/employees')}>
          Back to Roster
        </Button>
      </div>

      {loading && <LoadingState message="Processing system files..." />}

      {!loading && (
        <div className="card details-profile-card fade-in">
          {/* Top Banner / Avatar segment */}
          <div className="details-hero-section">
            <img
              src={getAvatarUrl(employee.name, employee.avatar)}
              alt={employee.name}
              className="details-avatar"
            />
            <div className="details-meta">
              <div className="details-name-row">
                <h2 className="details-full-name">{employee.name}</h2>
                <StatusBadge status={employee.status} />
              </div>
              <p className="details-role-display">{employee.designation}</p>
              <p className="details-id-display">{employee.id}</p>
            </div>
          </div>

          <hr className="details-divider" />

          {/* Grid fields segment */}
          <div className="details-info-grid">
            {/* Contact details */}
            <div className="details-section-column">
              <h3 className="details-section-title">Contact Information</h3>
              <div className="details-info-row">
                <FiMail className="info-row-icon" />
                <div className="info-row-text">
                  <span className="info-label">Email Address</span>
                  <a href={`mailto:${employee.email}`} className="info-value email-link">
                    {employee.email}
                  </a>
                </div>
              </div>
              <div className="details-info-row">
                <FiPhone className="info-row-icon" />
                <div className="info-row-text">
                  <span className="info-label">Phone Number</span>
                  <a href={`tel:${employee.phone}`} className="info-value">
                    {employee.phone || 'N/A'}
                  </a>
                </div>
              </div>
            </div>

            {/* Employment details */}
            <div className="details-section-column">
              <h3 className="details-section-title">Employment Information</h3>
              <div className="details-info-row">
                <FiBriefcase className="info-row-icon" />
                <div className="info-row-text">
                  <span className="info-label">Department</span>
                  <span className="info-value">{employee.department}</span>
                </div>
              </div>
              <div className="details-info-row">
                <FiDollarSign className="info-row-icon" />
                <div className="info-row-text">
                  <span className="info-label">Salary (Annual)</span>
                  <span className="info-value salary-val">{formatCurrency(employee.salary)}</span>
                </div>
              </div>
              <div className="details-info-row">
                <FiCalendar className="info-row-icon" />
                <div className="info-row-text">
                  <span className="info-label">Join Date</span>
                  <span className="info-value">{formatDate(employee.joinDate)}</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="details-divider" />

          {/* Action trigger panel */}
          <div className="details-footer-actions">
            <Button
              variant="outline"
              icon={FiEdit2}
              onClick={() => navigate(`/employees/edit/${employee.id}`)}
            >
              Edit Details
            </Button>
            <Button variant="danger" icon={FiTrash2} onClick={handleDeleteClick}>
              Delete Profile
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;
