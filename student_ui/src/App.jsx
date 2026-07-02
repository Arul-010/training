import { useState, useEffect } from 'react'
import './App.css'
import Grades from './components/Grades'
import Courses from './components/Courses'

// Initial mock data for display with purely numeric roll numbers below 1000
const INITIAL_STUDENTS = [
  { rollNumber: '101', name: 'Kolhi', dept: 'CSE', section: 'A', status: 'Present' },
  { rollNumber: '204', name: 'Donhi', dept: 'ECE', section: 'B', status: 'Absent' },
  { rollNumber: '302', name: 'Dube', dept: 'MECH', section: 'A', status: 'Present' },
  { rollNumber: '105', name: 'kl rahul', dept: 'CSE', section: 'C', status: 'Late' },
  { rollNumber: '112', name: 'Rohit', dept: 'EEE', section: 'B', status: 'Absent' }
]

const DEPT_SHORT_MAP = {
  'Computer Science and Engineering': 'CSE',
  'Electronics and Communication Engineering': 'ECE',
  'Electrical and Electronic Engineering': 'EEE',
  'Mechanical Engineering': 'MECH',
  'Civil Engineering': 'CIVIL',
  'Information Technology': 'IT',
  'Artificial Intelligence and Data Science': 'AI&DS',
  'Aeronautical Engineering': 'AERO'
}

const DEPARTMENTS = Object.keys(DEPT_SHORT_MAP)

const SECTIONS = ['A', 'B', 'C', 'D']

function App() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('attendance_students')
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS
  })

  // Form states
  const [rollNumber, setRollNumber] = useState('')
  const [name, setName] = useState('')
  const [dept, setDept] = useState(DEPARTMENTS[0])
  const [section, setSection] = useState(SECTIONS[0])
  const [status, setStatus] = useState('Present')

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDept, setFilterDept] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('attendance')

  // Notification state
  const [notification, setNotification] = useState(null)

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('attendance_students', JSON.stringify(students))
  }, [students])

  // Trigger temporary notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Handle student submit
  const handleAddStudent = (e) => {
    e.preventDefault()

    const cleanRoll = rollNumber.trim()

    // Validation
    if (!cleanRoll || !name.trim()) {
      showNotification('Please fill in Roll Number and Name!', 'error')
      return
    }

    // Strict numerical check
    const isOnlyDigits = /^\d+$/.test(cleanRoll)
    if (!isOnlyDigits) {
      showNotification('Roll Number must contain only digits!', 'error')
      return
    }

    const rollVal = parseInt(cleanRoll, 10)
    if (rollVal <= 0 || rollVal >= 1000) {
      showNotification('Roll Number must be between 1 and 999!', 'error')
      return
    }

    // Check duplicate roll number
    if (students.some(s => s.rollNumber === String(rollVal))) {
      showNotification(`Roll Number "${rollVal}" already exists!`, 'error')
      return
    }

    const newStudent = {
      rollNumber: String(rollVal),
      name: name.trim(),
      dept: DEPT_SHORT_MAP[dept] || dept,
      section,
      status
    }

    setStudents(prev => [newStudent, ...prev])
    showNotification(`${name} has been added successfully!`, 'success')

    // Reset fields
    setRollNumber('')
    setName('')
    setStatus('Present')
  }

  // Mark absent student as Present (Late)
  const handleMarkPresent = (roll) => {
    setStudents(prev => prev.map(s => {
      if (s.rollNumber === roll) {
        showNotification(`${s.name} marked as Present (Late)!`, 'info')
        return { ...s, status: 'Late' } // Using 'Late' to indicate status changed via button
      }
      return s
    }))
  }

  // Delete student
  const handleDeleteStudent = (roll, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setStudents(prev => prev.filter(s => s.rollNumber !== roll))
      showNotification(`Deleted roster entry for ${name}.`, 'warning')
    }
  }

  // Calculate statistics
  const totalCount = students.length
  const presentCount = students.filter(s => s.status === 'Present').length
  const absentCount = students.filter(s => s.status === 'Absent').length
  const lateCount = students.filter(s => s.status === 'Late').length
  const attendanceRate = totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 0

  // Filtered student list
  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = filterDept === 'All' || s.dept === filterDept
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus
    return matchesSearch && matchesDept && matchesStatus
  })

  // Get Initials for Avatar
  const getInitials = (fullName) => {
    const parts = fullName.split(' ')
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="portal-container">
      {/* Toast Notification */}
      {notification && (
        <div className={`notification-toast toast-${notification.type}`}>
          <span className="toast-icon">
            {notification.type === 'success' && '✅'}
            {notification.type === 'error' && '❌'}
            {notification.type === 'info' && '⚡'}
            {notification.type === 'warning' && '⚠️'}
          </span>
          <span className="toast-message">{notification.message}</span>
        </div>
      )}

      {/* Header Section */}
      <header className="portal-header">
        <div className="header-brand-container">
          <div className="site-brand">
            <img src="/logologo.png" alt="The Masterclass Logo" className="brand-logo" />
            <div className="brand-info">
              <h2 className="brand-name">The Masterclass</h2>
              <p className="brand-tagline">Practical courses to build modern web skills</p>
            </div>
          </div>
          <div className="header-badge">🏫 Administration Hub</div>
        </div>
        
        <h1 className="header-title">Student Management System</h1>
        <p className="header-subtitle">
          Real-time tracking, attendance status management, and analytics insights.
        </p>

        {/* Top Navigation */}
        <nav className="top-nav">
          <button 
            className={`nav-btn ${activeTab === 'attendance' ? 'active' : ''}`} 
            onClick={() => setActiveTab('attendance')}
          >
            Attendance Registry
          </button>
          <button 
            className={`nav-btn ${activeTab === 'grades' ? 'active' : ''}`} 
            onClick={() => setActiveTab('grades')}
          >
            Grades & Marks
          </button>
          <button 
            className={`nav-btn ${activeTab === 'courses' ? 'active' : ''}`} 
            onClick={() => setActiveTab('courses')}
          >
            Courses & Syllabus
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      {activeTab === 'attendance' && (
        <>
          {/* Analytics dashboard */}
          <section className="stats-dashboard">
        <div className="stat-card card-total">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-label">Total Registered</span>
            <span className="stat-val">{totalCount}</span>
          </div>
        </div>
        <div className="stat-card card-present">
          <div className="stat-icon">🟢</div>
          <div className="stat-info">
            <span className="stat-label">Present Today</span>
            <span className="stat-val">{presentCount}</span>
          </div>
        </div>
        <div className="stat-card card-absent">
          <div className="stat-icon">🔴</div>
          <div className="stat-info">
            <span className="stat-label">Absent Today</span>
            <span className="stat-val">{absentCount}</span>
          </div>
        </div>
        <div className="stat-card card-late">
          <div className="stat-icon">🟡</div>
          <div className="stat-info">
            <span className="stat-label">Late Arrivals</span>
            <span className="stat-val">{lateCount}</span>
          </div>
        </div>
        <div className="stat-card card-rate">
          <div className="stat-percentage-ring">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path className="circle"
                strokeDasharray={`${attendanceRate}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage">{attendanceRate}%</text>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Attendance Rate</span>
          </div>
        </div>
      </section>

      {/* Main Workspace Layout */}
      <main className="portal-workspace">
        
        {/* Left Side: Add Student Form */}
        <section className="form-card-container">
          <div className="form-card">
            <div className="card-header-accent">
              <h3>📝 Add Student Roster</h3>
              <p>Enter details to append a new record</p>
            </div>

            <form onSubmit={handleAddStudent} className="student-form">
              <div className="form-group">
                <label htmlFor="rollNum">Roll Number (Max 999)</label>
                <input
                  id="rollNum"
                  type="text"
                  placeholder="e.g., 109"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={rollNumber}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || /^\d+$/.test(val)) {
                      setRollNumber(val);
                    }
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="studentName">Student Name</label>
                <input
                  id="studentName"
                  type="text"
                  placeholder="e.g., Karthik Raja"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="deptSelect">Department</label>
                <select
                  id="deptSelect"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="sectSelect">Section</label>
                <select
                  id="sectSelect"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                >
                  {SECTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Attendance Status</label>
                <div className="radio-tile-group">
                  <label className={`radio-tile-label ${status === 'Present' ? 'active-present' : ''}`}>
                    <input
                      type="radio"
                      name="status"
                      value="Present"
                      checked={status === 'Present'}
                      onChange={() => setStatus('Present')}
                    />
                    <div className="tile-content">
                      <span className="tile-icon">🟢</span>
                      <span>Present</span>
                    </div>
                  </label>

                  <label className={`radio-tile-label ${status === 'Absent' ? 'active-absent' : ''}`}>
                    <input
                      type="radio"
                      name="status"
                      value="Absent"
                      checked={status === 'Absent'}
                      onChange={() => setStatus('Absent')}
                    />
                    <div className="tile-content">
                      <span className="tile-icon">🔴</span>
                      <span>Absent</span>
                    </div>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-submit">
                <span>➕ Add Student to Roster</span>
              </button>
            </form>
          </div>
        </section>

        {/* Right Side: Table Directory */}
        <section className="directory-card-container">
          <div className="directory-card">
            
            {/* Filter Toolbar */}
            <div className="toolbar">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <div className="filter-item">
                  <label htmlFor="filterDept">Dept</label>
                  <select
                    id="filterDept"
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                  >
                    <option value="All">All Departments</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-item">
                  <label htmlFor="filterStatus">Status</label>
                  <select
                    id="filterStatus"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Present">🟢 Present</option>
                    <option value="Absent">🔴 Absent</option>
                    <option value="Late">🟡 Late</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table wrapper */}
            <div className="table-responsive">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Roll Number</th>
                    <th>Student Info</th>
                    <th>Department</th>
                    <th>Section</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((s) => (
                      <tr key={s.rollNumber} className="table-row-animated">
                        <td className="roll-col">{s.rollNumber}</td>
                        <td className="student-info-col">
                          <div className="avatar">
                            {getInitials(s.name)}
                          </div>
                          <div className="name-details">
                            <span className="student-name">{s.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="dept-tag">{s.dept}</span>
                        </td>
                        <td>
                          <span className="section-badge">Sec {s.section}</span>
                        </td>
                        <td>
                          <span className={`status-pill pill-${s.status.toLowerCase()}`}>
                            {s.status === 'Present' && '🟢 Present'}
                            {s.status === 'Absent' && '🔴 Absent'}
                            {s.status === 'Late' && '🟡 Late'}
                          </span>
                        </td>
                        <td className="actions-col">
                          {s.status === 'Absent' && (
                            <button
                              onClick={() => handleMarkPresent(s.rollNumber)}
                              className="btn-action-present"
                              title="Mark as Present (Late)"
                            >
                              ✔️ Mark Present
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteStudent(s.rollNumber, s.name)}
                            className="btn-action-delete"
                            title="Remove student"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        <div className="empty-icon">📭</div>
                        <p>No matching student roster records found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* List Footer Count Info */}
            <div className="directory-footer">
              Showing {filteredStudents.length} of {students.length} students registered.
            </div>

          </div>
        </section>

      </main>
      </>
      )}

      {activeTab === 'grades' && <Grades />}
      {activeTab === 'courses' && <Courses />}
    </div>
  )
}

export default App
