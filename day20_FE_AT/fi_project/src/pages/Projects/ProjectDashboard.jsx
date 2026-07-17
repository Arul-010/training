import React from 'react';
import { useEmployees } from '../../context/EmployeeContext';
import {
  FiArrowLeft, FiCheck, FiClock, FiCalendar,
  FiTrendingUp, FiActivity, FiUsers, FiBriefcase
} from 'react-icons/fi';
import './ProjectDashboard.css';

// A simple string hash helper for generating stable random numbers per project
const getHash = (str) => {
  let hash = 0;
  if (!str) return hash;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const ProjectDashboard = ({ project, onBack }) => {
  const { employees } = useEmployees();

  const hash = getHash(project.id);

  // 1. Resolve project members
  const projectMembers = (project.memberIds || []).map(id => employees.find(e => e.id === id)).filter(Boolean);

  // If the project doesn't have enough members, fill up with stable mock members from the active pool
  const activePool = employees.filter(e => e.status === 'Active');
  const displayMembers = [...projectMembers];
  if (displayMembers.length < 4) {
    activePool.forEach(emp => {
      if (!displayMembers.some(m => m.id === emp.id) && displayMembers.length < 5) {
        displayMembers.push(emp);
      }
    });
  }

  // Fallback if no employees exist in context at all
  if (displayMembers.length === 0) {
    displayMembers.push(
      { id: 'm1', name: 'Georg', designation: 'Developer' },
      { id: 'm2', name: 'Nancy', designation: 'Developer' },
      { id: 'm3', name: 'Richard', designation: 'Designer' },
      { id: 'm4', name: 'Kate', designation: 'QA' },
      { id: 'm5', name: 'Paula', designation: 'Analyst' }
    );
  }

  // 2. Dynamically calculate stable milestone progress
  const isActive = project.status === 'Active';
  const projectTasks = project.tasks || [];
  const devProgress = projectTasks.length > 0
    ? Math.round(projectTasks.reduce((sum, t) => sum + (t.progress || 0), 0) / projectTasks.length)
    : 50 + (hash % 25);
  const designProgress = 15 + (hash % 15); // e.g. 15% to 29%

  // 3. Dynamically calculate launch date (stable in future)
  let daysRemaining;
  let launchDateString;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (project.deadline) {
    const targetDate = new Date(project.deadline + 'T00:00:00');
    const diffTime = targetDate - today;
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    launchDateString = targetDate.toLocaleDateString('en-US', options);
  } else {
    daysRemaining = 90 + (hash % 40); // 90 to 129 days
    const launchDate = new Date(today.getTime() + daysRemaining * 24 * 60 * 60 * 1000);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    launchDateString = launchDate.toLocaleDateString('en-US', options);
  }

  // 4. Dynamically calculate project budget
  const totalBudget = 40000 + (hash % 6) * 5000; // $40k to $65k
  const remainingBudget = 5000 + (hash % 10) * 500; // $5k to $9.5k
  const usedBudget = totalBudget - remainingBudget;
  // Make used budget slightly higher than target budget to show target/over target
  const targetBudget = Math.round(usedBudget * 0.92);
  const overTargetDiff = usedBudget - targetBudget;
  const overTargetPercent = ((overTargetDiff / targetBudget) * 100).toFixed(1);

  // 5. Generate Overdue Tasks
  const overdueTasksData = [
    {
      task: 'Update facebook profile',
      overdueDays: 1,
      overdueStyle: 'yellow-overdue',
      deadline: '2026-08-15',
      employee: displayMembers[0]?.name || 'Paula'
    },
    {
      task: 'Update testing plan',
      overdueDays: 4,
      overdueStyle: 'orange-overdue',
      deadline: '2026-08-06',
      employee: displayMembers[1]?.name || 'Kate'
    },
    {
      task: 'Configure desktop',
      overdueDays: 10,
      overdueStyle: 'lightred-overdue',
      deadline: '2026-08-01',
      employee: displayMembers[2]?.name || 'Nancy'
    },
    {
      task: 'Set up new database',
      overdueDays: 24,
      overdueStyle: 'red-overdue',
      deadline: '2026-07-18',
      employee: displayMembers[3]?.name || 'Georg'
    }
  ];

  // 6. Generate Workload Data
  const workloadData = displayMembers.slice(0, 5).map((m, idx) => {
    const percentages = [67, 55, 48, 45, 30];
    return {
      name: m.name.split(' ')[0],
      percentage: percentages[idx] || 25
    };
  });

  // 7. Generate Upcoming Deadlines Data
  const upcomingDeadlinesData = [
    {
      employee: displayMembers[1]?.name || 'Kate',
      task: 'Update twitter profile',
      deadline: '2026-08-15',
      workload: 34
    },
    {
      employee: displayMembers[0]?.name || 'Georg',
      task: 'E-Commerce Dashboard',
      deadline: '2026-08-06',
      workload: 56
    },
    {
      employee: displayMembers[2]?.name || 'Nancy',
      task: 'Set up dev environment',
      deadline: '2026-08-01',
      workload: 15
    },
    {
      employee: displayMembers[4]?.name || 'Paula',
      task: 'Hire Data Scientist',
      deadline: '2026-07-18',
      workload: 11
    }
  ];

  return (
    <div className="project-dashboard-wrapper fade-in">
      {/* ── Dashboard Header / Navigation ── */}
      <header className="dashboard-navigation">
        <button className="back-to-board-btn" onClick={onBack}>
          <FiArrowLeft /> Back to Project Board
        </button>
        <div className="dashboard-header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="project-dashboard-icon">📊</span>
            <div>
              <h2>{project.name}</h2>
              <p className="project-dashboard-desc">{project.description || 'Project details and analysis'}</p>
            </div>
          </div>
          <span className={`project-status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
            {isActive ? 'Active Progress' : 'Inactive'}
          </span>
        </div>
      </header>

      {/* ── Row 1: Milestones & Projected Launch Date ── */}
      <div className="dashboard-row-top">
        <div className="card milestones-card">
          {/* Milestone timeline progress bar */}
          <div className="timeline-progress-bar-container">
            <div 
              className="timeline-progress-bar-fill" 
              style={{ width: isActive ? `calc(50% + (25% * ${devProgress} / 100))` : `calc(25% * ${designProgress} / 100)` }}
            />
          </div>

          <div className="milestones-steps">
            {/* Step 1: Planning */}
            <div className="milestone-step completed">
              <div className="milestone-circle completed">
                <FiCheck />
              </div>
              <span className="milestone-name">Planning</span>
              <span className="milestone-status">Completed</span>
            </div>

            {/* Step 2: Design */}
            <div className={`milestone-step ${isActive ? 'completed' : 'in-progress'}`}>
              <div className={`milestone-circle ${isActive ? 'completed' : 'in-progress'}`}>
                {isActive ? <FiCheck /> : `${designProgress}%`}
              </div>
              <span className="milestone-name">Design</span>
              <span className="milestone-status">{isActive ? 'Completed' : 'In Progress'}</span>
            </div>

            {/* Step 3: Development */}
            <div className={`milestone-step ${isActive ? 'in-progress' : 'waiting'}`}>
              <div className={`milestone-circle ${isActive ? 'in-progress' : 'waiting'}`}>
                {isActive ? `${devProgress}%` : <FiClock />}
              </div>
              <span className="milestone-name">Development</span>
              <span className="milestone-status">{isActive ? 'In Progress' : 'Waiting'}</span>
            </div>

            {/* Step 4: Testing */}
            <div className="milestone-step waiting">
              <div className="milestone-circle waiting">
                <FiClock />
              </div>
              <span className="milestone-name">Testing</span>
              <span className="milestone-status">Waiting</span>
            </div>
          </div>
        </div>

        {/* Projected Launch Date Box */}
        <div className="launch-date-box">
          <span className="launch-box-label">Projected Launch Date</span>
          <div className="launch-box-center">
            <span className="launch-box-flag-icon">🏁</span>
            <div className="launch-box-time">
              <h3>{daysRemaining} Days</h3>
              <p>{launchDateString}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Budget & Overdue Tasks ── */}
      <div className="dashboard-grid-two-columns">
        {/* Project Budget Card */}
        <div className="card project-budget-card">
          <h3 className="card-section-title">Project Budget</h3>
          
          <div className="budget-flex-container">
            {/* Chart Area */}
            <div className="budget-chart-container">
              <div className="budget-chart-axis">
                <span className="axis-label">$60K</span>
                <span className="axis-label">$40K</span>
                <span className="axis-label">$20K</span>
                <span className="axis-label">$0K</span>
              </div>
              
              <div className="budget-chart-bars">
                {/* Bar 1: Total Budget */}
                <div className="budget-bar-wrapper">
                  <div 
                    className="budget-bar total-bar" 
                    style={{ height: `${(totalBudget / 60000) * 100}%` }}
                    title={`Total Budget: $${totalBudget.toLocaleString()}`}
                  />
                </div>
                {/* Bar 2: Budget Amount Used */}
                <div className="budget-bar-wrapper">
                  <div 
                    className="budget-bar used-bar" 
                    style={{ height: `${(usedBudget / 60000) * 100}%` }}
                    title={`Used Budget: $${usedBudget.toLocaleString()}`}
                  />
                </div>
                {/* Bar 3: Target Amount Used */}
                <div className="budget-bar-wrapper">
                  <div 
                    className="budget-bar target-bar" 
                    style={{ height: `${(targetBudget / 60000) * 100}%` }}
                    title={`Target Budget: $${targetBudget.toLocaleString()}`}
                  />
                </div>
              </div>
            </div>

            {/* Budget Details Metrics List */}
            <div className="budget-metrics-details">
              <div className="budget-metric-row">
                <span className="budget-metric-lbl">Total Budget</span>
                <span className="budget-metric-val">${totalBudget.toLocaleString()}</span>
              </div>
              <div className="budget-metric-row">
                <span className="budget-metric-lbl">Remaining</span>
                <span className="budget-metric-val remaining-val">${remainingBudget.toLocaleString()}</span>
              </div>
              <div className="budget-metric-row align-center">
                <span className="budget-metric-lbl">Currently</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="status-indicator-dot red-dot"></span>
                    <span className="budget-metric-val red-text font-bold">{overTargetPercent}%</span>
                  </div>
                  <span className="budget-metric-lbl-sub">Over Target</span>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Chart Legend */}
          <div className="budget-chart-legend">
            <div className="legend-item">
              <span className="legend-color-dot total-dot"></span>
              <span>Total Budget</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-dot used-dot"></span>
              <span>Budget Amount Used</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-dot target-dot"></span>
              <span>Target Amount Used</span>
            </div>
          </div>
        </div>

        {/* Overdue Tasks Card */}
        <div className="card overdue-tasks-card">
          <h3 className="card-section-title">Overdue Tasks</h3>
          
          <div className="table-responsive-container">
            <table className="dashboard-table overdue-table">
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Overdue</th>
                  <th style={{ width: '45%' }}>Task</th>
                  <th style={{ width: '20%' }}>Deadline</th>
                  <th style={{ width: '20%' }}>Employee</th>
                </tr>
              </thead>
              <tbody>
                {overdueTasksData.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className={`overdue-days-badge ${item.overdueStyle}`}>
                        {item.overdueDays} {item.overdueDays === 1 ? 'Day' : 'Days'}
                      </span>
                    </td>
                    <td className="task-name-cell">{item.task}</td>
                    <td className="deadline-cell">{item.deadline}</td>
                    <td className="employee-cell font-medium">{item.employee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Row 3: Workload & Upcoming Deadlines ── */}
      <div className="dashboard-grid-two-columns">
        {/* Workload Card */}
        <div className="card workload-card">
          <h3 className="card-section-title">Workload</h3>
          
          <div className="workload-chart-container">
            {/* Chart Area */}
            <div className="workload-chart-bars">
              {workloadData.map((data, idx) => (
                <div key={idx} className="workload-bar-wrapper">
                  <div className="workload-bar-percent-label">{data.percentage}%</div>
                  <div 
                    className="workload-bar" 
                    style={{ height: `${data.percentage}%` }}
                    title={`${data.name}: ${data.percentage}% workload`}
                  />
                  <div className="workload-bar-name-label">{data.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines Card */}
        <div className="card upcoming-deadlines-card">
          <h3 className="card-section-title">Upcoming Deadlines</h3>
          
          <div className="table-responsive-container">
            <table className="dashboard-table upcoming-table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Employee</th>
                  <th style={{ width: '40%' }}>Task</th>
                  <th style={{ width: '20%' }}>Deadline</th>
                  <th style={{ width: '20%' }}>Workload</th>
                </tr>
              </thead>
              <tbody>
                {upcomingDeadlinesData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="employee-cell font-medium">{item.employee}</td>
                    <td className="task-name-cell">{item.task}</td>
                    <td className="deadline-cell">{item.deadline}</td>
                    <td>
                      <div className="deadline-workload-cell">
                        <div className="workload-mini-track">
                          <div className="workload-mini-fill" style={{ width: `${item.workload}%` }} />
                        </div>
                        <span className="workload-mini-percent">{item.workload}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
