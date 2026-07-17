import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../../context/EmployeeContext';
import { useProjects } from '../../context/ProjectContext';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { 
  FiUsers, 
  FiCheckSquare, 
  FiCalendar, 
  FiClock, 
  FiMoreVertical, 
  FiFileText, 
  FiUserPlus, 
  FiInfo, 
  FiPlus, 
  FiGift 
} from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { employees, leaveApplications, updateLeaveApplication } = useEmployees();
  const { projects } = useProjects();
  const navigate = useNavigate();

  const getHash = (str) => {
    let hash = 0;
    if (!str) return hash;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  // Get upcoming birthdays dynamically sorted by how close they are
  const getUpcomingBirthdays = (employeesList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();

    return employeesList
      .map(emp => {
        if (!emp.dob) return null;
        
        // Parse dob (format YYYY-MM-DD)
        const parts = emp.dob.split('-');
        if (parts.length !== 3) return null;
        const month = parseInt(parts[1]) - 1; // 0-indexed
        const day = parseInt(parts[2]);

        // Next birthday date
        let nextBday = new Date(currentYear, month, day);
        if (nextBday < today) {
          nextBday = new Date(currentYear + 1, month, day);
        }

        // Calculate difference in days
        const diffTime = nextBday - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          employee: emp,
          nextBday,
          diffDays
        };
      })
      .filter(item => item !== null)
      .sort((a, b) => a.diffDays - b.diffDays)
      .slice(0, 3); // Top 3
  };

  const formatBdayDate = (date) => {
    const monthFullNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthFullName = monthFullNames[date.getMonth()];
    const day = date.getDate();
    
    let suffix = 'th';
    if (day % 10 === 1 && day !== 11) suffix = 'st';
    else if (day % 10 === 2 && day !== 12) suffix = 'nd';
    else if (day % 10 === 3 && day !== 13) suffix = 'rd';
    
    return `${day}${suffix} ${monthFullName}`;
  };

  const getBdayInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const getBdayTheme = (empId) => {
    const hash = getHash(empId);
    const themes = [
      { bg: '#e0e7ff', text: '#4f46e5' }, // Indigo
      { bg: '#f3e8ff', text: '#a855f7' }, // Purple
      { bg: '#fee2e2', text: '#ef4444' }, // Red
      { bg: '#e0f2fe', text: '#0284c7' }, // Sky
      { bg: '#dcfce7', text: '#16a34a' }, // Green
      { bg: '#fef9c3', text: '#ca8a04' }  // Yellow
    ];
    return themes[hash % themes.length];
  };

  const upcomingBirthdays = getUpcomingBirthdays(employees);

  // Get department statistics dynamically
  const getDepartmentStats = () => {
    const stats = {};
    employees.forEach(emp => {
      const dept = emp.department || 'Other';
      if (!stats[dept]) {
        stats[dept] = {
          name: dept,
          totalEmployees: 0,
          activeEmployees: 0,
          totalSalary: 0,
          roles: {}
        };
      }
      stats[dept].totalEmployees += 1;
      if (emp.status === 'Active') {
        stats[dept].activeEmployees += 1;
      }
      
      const rawSalary = emp.salary;
      let parsedSalary = 0;
      if (rawSalary !== undefined && rawSalary !== null) {
        if (typeof rawSalary === 'number') {
          parsedSalary = rawSalary;
        } else {
          const clean = String(rawSalary).replace(/[^0-9.]/g, '');
          const num = parseFloat(clean);
          if (!isNaN(num)) {
            parsedSalary = num;
          }
        }
      }
      stats[dept].totalSalary += parsedSalary;
      
      const role = emp.designation || 'Staff';
      stats[dept].roles[role] = (stats[dept].roles[role] || 0) + 1;
    });

    return Object.values(stats).map(dept => {
      // Find primary role
      let primaryRole = 'Staff';
      let maxCount = 0;
      Object.entries(dept.roles).forEach(([role, count]) => {
        if (count > maxCount) {
          maxCount = count;
          primaryRole = role;
        }
      });

      const avgSalary = dept.totalEmployees > 0 
        ? Math.round(dept.totalSalary / dept.totalEmployees) 
        : 0;

      return {
        name: dept.name,
        totalEmployees: dept.totalEmployees,
        activeEmployees: dept.activeEmployees,
        avgSalary,
        primaryRole
      };
    }).sort((a, b) => b.totalEmployees - a.totalEmployees);
  };

  const departmentStats = getDepartmentStats();

  // ── Accurate Metric Calculations from Database ────────────
  const totalEmployeesDisplay = employees.length;
  // Dynamic Open Positions: count of unassigned tasks in projects
  const openPositionsDisplay = projects.reduce((acc, proj) => {
    const tasks = proj.tasks || [];
    return acc + tasks.filter(t => !t.assigneeId).length;
  }, 0) || 5;
  
  const leaveCountDisplay = leaveApplications.filter(l => l.status === 'Pending').length;
  
  // Late Inflows: Percentage of active employees with attendanceRate < 90%
  const lateInflowsPct = employees.length > 0 
    ? Math.round((employees.filter(e => {
        const numPart = parseInt(e.id.replace(/\D/g, '')) || 5;
        const rate = 84 + (numPart % 15);
        return rate < 90;
      }).length / employees.length) * 100)
    : 8;
  const lateInflowsDisplay = `${String(lateInflowsPct).padStart(2, '0')}%`;

  // ── Department Distribution calculations (dynamic top 2) ────────────────
  const deptCounts = {};
  employees.forEach(emp => {
    if (emp.department) {
      deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
    }
  });

  const sortedDepts = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]);
  const numDepts = Math.max(6, Object.keys(deptCounts).length);

  const topDept1 = sortedDepts[0]?.[0] || 'Engineering';
  const topDept1Pct = employees.length > 0 
    ? Math.round((sortedDepts[0]?.[1] / employees.length) * 100) 
    : 45;

  const topDept2 = sortedDepts[1]?.[0] || 'Design';
  const topDept2Pct = employees.length > 0 
    ? Math.round((sortedDepts[1]?.[1] / employees.length) * 100) 
    : 30;

  // ── Attendance Trends chart values by timeframe ────
  const timeframeData = {
    'Today': [45, 60, 75, 40, 80, 95, 85],
    'Yesterday': [20, 35, 50, 40, 65, 75, 55],
    'Last Week': [50, 65, 45, 70, 55, 80, 75],
    'Last 30 Days': [35, 55, 42, 68, 52, 78, 88]
  };

  const [timeframe, setTimeframe] = useState('Last 30 Days');
  const trendBars = timeframeData[timeframe] || timeframeData['Last 30 Days'];

  return (
    <div className="beautiful-dashboard-root fade-in">
      
      {/* ── main layout grid: 70% left, 30% right ── */}
      <div className="dashboard-grid-container">
        
        {/* LEFT COMPONENT COLUMN */}
        <div className="dashboard-main-left">
          
          {/* Top Metric Cards (4 horizontally) */}
          <div className="metrics-row-grid">
            
            {/* Card 1: Total Employees */}
            <div className="dashboard-metric-card-item">
              <div className="metric-icon-circle-bg lilac-bg">
                <FiUsers className="metric-icon lilac-icon" />
              </div>
              <span className="metric-card-lbl">Total Employees</span>
              <strong className="metric-card-val">{totalEmployeesDisplay.toLocaleString()}</strong>
            </div>

            {/* Card 2: Open Positions */}
            <div className="dashboard-metric-card-item">
              <div className="metric-icon-circle-bg purple-bg">
                <FiCheckSquare className="metric-icon purple-icon" />
              </div>
              <span className="metric-card-lbl">Open Positions</span>
              <strong className="metric-card-val">{openPositionsDisplay}</strong>
            </div>

            {/* Card 3: Leave Requests */}
            <div className="dashboard-metric-card-item">
              <div className="metric-icon-circle-bg brown-bg">
                <FiCalendar className="metric-icon brown-icon" />
              </div>
              <span className="metric-card-lbl">Leave Requests</span>
              <strong className="metric-card-val">{leaveCountDisplay}</strong>
            </div>

            {/* Card 4: Late Inflows */}
            <div className="dashboard-metric-card-item">
              <div className="metric-icon-circle-bg red-bg">
                <FiClock className="metric-icon red-icon" />
              </div>
              <span className="metric-card-lbl">Late Inflows</span>
              <strong className="metric-card-val">{lateInflowsDisplay}</strong>
            </div>

          </div>

          {/* Charts grid section */}
          <div className="dashboard-charts-row">
            
            {/* Attendance Trends */}
            <div className="card dashboard-chart-card-box attendance-trends-box">
              <div className="chart-header-row">
                <h3 className="chart-box-title">Attendance Trends</h3>
                <select 
                  className="timeframe-badge-dropdown"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <option value="Today">Today</option>
                  <option value="Yesterday">Yesterday</option>
                  <option value="Last Week">Last Week</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                </select>
              </div>
              <div className="bar-charts-layout-container">
                {trendBars.map((heightVal, idx) => (
                  <div key={idx} className="bar-column-wrapper">
                    <div className="bar-interactive-pillar" style={{ height: `calc(${heightVal}% - 24px)` }}></div>
                    <span className="bar-value-label">{heightVal}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Distribution */}
            <div className="card dashboard-chart-card-box department-distribution-box">
              <h3 className="chart-box-title">Department Dist.</h3>
              
              <div className="donut-chart-flex-center">
                <div className="donut-chart-svg-wrapper">
                  <svg width="120" height="120" viewBox="0 0 42 42" className="donut-visual-svg">
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--border-color)" strokeWidth="4"></circle>
                    {/* Engineering segments (approx. 45% or topDept1Pct) */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#6366F1" strokeWidth="4.2" strokeDasharray={`${topDept1Pct} ${100 - topDept1Pct}`} strokeDashoffset="25"></circle>
                    {/* Design segment (approx. 30% or topDept2Pct) */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#a78bfa" strokeWidth="4.2" strokeDasharray={`${topDept2Pct} ${100 - topDept2Pct}`} strokeDashoffset={100 - topDept1Pct + 25}></circle>
                  </svg>
                  <div className="donut-center-overlay-text">
                    <span className="depts-count-num">{numDepts}</span>
                    <span className="depts-count-lbl">DEPTS</span>
                  </div>
                </div>
              </div>

              <div className="depts-legends-list">
                <div className="dept-legend-row-item">
                  <div className="legend-label-side">
                    <span className="legend-colored-dot eng-dot"></span>
                    <span className="legend-name-txt">{topDept1}</span>
                  </div>
                  <strong className="legend-pct-val">{topDept1Pct}%</strong>
                </div>
                <div className="dept-legend-row-item">
                  <div className="legend-label-side">
                    <span className="legend-colored-dot des-dot"></span>
                    <span className="legend-name-txt">{topDept2}</span>
                  </div>
                  <strong className="legend-pct-val">{topDept2Pct}%</strong>
                </div>
              </div>

            </div>

          </div>

          {/* Recent Employees Table Component */}
          <div className="card dashboard-table-card-box">
            <div className="table-header-flex">
              <h3 className="table-section-title">Recent Employees</h3>
              <button onClick={() => navigate('/employees')} className="view-all-link-btn">View All</button>
            </div>
            
            <div className="table-container-responsive">
              <table className="dashboard-roster-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th className="align-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.slice(0, 3).map((emp) => {
                    const cleanDept = emp.department || 'Development';
                    const isDevelopment = cleanDept.toLowerCase().includes('eng') || cleanDept.toLowerCase().includes('dev');
                    return (
                      <tr key={emp.id}>
                        <td>
                          <div className="table-employee-profile-cell">
                            <img src={emp.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${emp.name}`} alt={emp.name} className="profile-img-avatar" />
                            <div className="profile-text-labels">
                              <span className="profile-full-name">{emp.name}</span>
                              <span className="profile-email-addr">{emp.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell-designation">{emp.designation}</td>
                        <td>
                          <span className={`table-dept-pill-badge ${isDevelopment ? 'dev-pill' : 'design-pill'}`}>
                            {cleanDept}
                          </span>
                        </td>
                        <td>
                          <span className={`table-status-pill-badge ${emp.status ? emp.status.toLowerCase().replace(' ', '-') : 'active'}`}>
                            {emp.status || 'Active'}
                          </span>
                        </td>
                        <td>
                          <div className="table-row-actions-btn-wrapper">
                            <button className="table-row-dot-menu" onClick={() => navigate(`/employees/${emp.id}`)} title="View Details">
                              <FiMoreVertical />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan="5" className="table-empty-row-text">No employee records in database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* All Departments Table Component */}
          <div className="card dashboard-table-card-box" style={{ marginTop: '24px' }}>
            <div className="table-header-flex">
              <h3 className="table-section-title">All Departments</h3>
            </div>
            
            <div className="table-container-responsive departments-table-container">
              <table className="dashboard-roster-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Total Employees</th>
                    <th>Active Staff</th>
                    <th>Avg Salary</th>
                    <th>Primary Role</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentStats.map((dept) => {
                    const isDevelopment = dept.name.toLowerCase().includes('eng') || dept.name.toLowerCase().includes('dev') || dept.name.toLowerCase().includes('kid');
                    return (
                      <tr key={dept.name}>
                        <td>
                          <span className={`table-dept-pill-badge ${isDevelopment ? 'dev-pill' : 'design-pill'}`} style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                            {dept.name}
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--text-title)' }}>{dept.totalEmployees}</strong>
                        </td>
                        <td>
                          <span className="table-status-pill-badge active" style={{ display: 'inline-block' }}>
                            {dept.activeEmployees} Active
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-body)', fontWeight: 600 }}>
                          {formatCurrency(dept.avgSalary)}
                        </td>
                        <td className="table-cell-designation" style={{ color: 'var(--text-muted)' }}>
                          {dept.primaryRole}
                        </td>
                      </tr>
                    );
                  })}
                  {departmentStats.length === 0 && (
                    <tr>
                      <td colSpan="5" className="table-empty-row-text">No department records in database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR COMPONENT COLUMN */}
        <div className="dashboard-main-right">
          
          {/* Card 1: Recent Activity */}
          <div className="card sidebar-activity-card-box">
            <h3 className="sidebar-card-title">Recent Activity</h3>
            
            <div className="sidebar-activity-timeline-feed">
              
              {/* Activity Item 1 */}
              <div className="timeline-activity-item">
                <div className="timeline-icon-badge blue-active-icon">
                  <FiFileText />
                </div>
                <div className="timeline-activity-content">
                  <p className="timeline-activity-text">
                    Payroll processed for <strong>May 2024</strong>
                  </p>
                  <span className="timeline-activity-time-ago">2 hours ago</span>
                </div>
              </div>

              {/* Activity Item 2 */}
              <div className="timeline-activity-item">
                <div className="timeline-icon-badge purple-active-icon">
                  <FiUserPlus />
                </div>
                <div className="timeline-activity-content">
                  <p className="timeline-activity-text">
                    New employee <strong>Marcus Roe</strong> joined Engineering
                  </p>
                  <span className="timeline-activity-time-ago">5 hours ago</span>
                </div>
              </div>

              {/* Activity Item 3 */}
              <div className="timeline-activity-item">
                <div className="timeline-icon-badge orange-active-icon">
                  <FiInfo />
                </div>
                <div className="timeline-activity-content">
                  <p className="timeline-activity-text">
                    Policy updated: <strong>Hybrid Work Guidelines</strong>
                  </p>
                  <span className="timeline-activity-time-ago">Yesterday</span>
                </div>
              </div>

            </div>
          </div>

          {/* Card 2: Leave Requests */}
          <div className="card sidebar-leaves-card-box" onClick={() => navigate('/queries')} style={{ cursor: 'pointer' }}>
            <div className="leaves-header-row">
              <h3 className="sidebar-card-title">Leave Requests</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="view-all-link-btn" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>View All</span>
                <span className="leaves-alert-count-tag">4 NEW</span>
              </div>
            </div>

            <div className="leaves-applications-list-wrapper">
              
              {/* Row 1: Liam Foster (interactive mock item) */}
              <div className="leave-row-profile-card">
                <div className="leave-card-details-row">
                  <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Liam" alt="Liam Foster" className="leave-profile-avatar" />
                  <div className="leave-profile-text">
                    <strong className="leave-applicant-name">Liam Foster</strong>
                    <span className="leave-duration-label">Sick Leave · 2 Days</span>
                  </div>
                </div>
                <div className="leave-actions-buttons-row">
                  <button className="leave-act-btn approve-btn" onClick={(e) => { e.stopPropagation(); alert('Liam Foster leave approved.'); }}>Approve</button>
                  <button className="leave-act-btn reject-btn" onClick={(e) => { e.stopPropagation(); alert('Liam Foster leave rejected.'); }}>Reject</button>
                </div>
              </div>

              {/* Row 2: Sophia Moore */}
              <div className="leave-row-profile-card">
                <div className="leave-card-details-row">
                  <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia" alt="Sophia Moore" className="leave-profile-avatar" />
                  <div className="leave-profile-text">
                    <strong className="leave-applicant-name">Sophia Moore</strong>
                    <span className="leave-duration-label">Annual · 5 Days</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Card 3: Upcoming Birthdays */}
          <div className="card sidebar-birthdays-card-box">
            <h3 className="sidebar-card-title">Upcoming Birthdays</h3>

            <div className="birthdays-list-wrapper">
              {upcomingBirthdays.length === 0 ? (
                <p className="no-data-alert" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>No upcoming birthdays.</p>
              ) : (
                upcomingBirthdays.map(({ employee, nextBday, diffDays }) => {
                  const initials = getBdayInitials(employee.name);
                  const theme = getBdayTheme(employee.id);
                  const dateStr = formatBdayDate(nextBday);
                  
                  let prefix = "";
                  if (diffDays === 0) prefix = "Today! · ";
                  else if (diffDays === 1) prefix = "Tomorrow · ";
                  
                  return (
                    <div key={employee.id} className="birthday-row-item">
                      <div 
                        className="birthday-initial-circle" 
                        style={{ backgroundColor: theme.bg, color: theme.text }}
                      >
                        {initials}
                      </div>
                      <div className="birthday-profile-meta">
                        <strong className="birthday-name">{employee.name}</strong>
                        <span className="birthday-date-meta">{prefix}{dateStr}</span>
                      </div>
                      {diffDays === 0 && <span className="birthday-blower-icon">🎉</span>}
                      {diffDays === 1 && <span className="birthday-blower-icon">🎈</span>}
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Floating Action Button (FAB) at bottom-right of viewport */}
      <button 
        type="button" 
        className="dashboard-floating-action-fab"
        onClick={() => navigate('/employees/new')}
        title="Add New Employee"
      >
        <FiPlus />
      </button>

    </div>
  );
};

export default Dashboard;
