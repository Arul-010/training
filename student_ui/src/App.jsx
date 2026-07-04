import { useState, useEffect } from 'react'
import './App.css'
import Grades from './components/Grades'
import Courses from './components/Courses'

// Initial mock data for display with purely numeric roll numbers below 1000
const INITIAL_STUDENTS = [
  { rollNumber: '101', name: 'Kohli Virat',      dept: 'CSE',   section: 'A', status: 'Present' },
  { rollNumber: '102', name: 'Sharma Rohit',     dept: 'CSE',   section: 'A', status: 'Absent'  },
  { rollNumber: '103', name: 'Dhoni Mahendra',   dept: 'CSE',   section: 'A', status: 'Present' },
  { rollNumber: '104', name: 'Jadeja Ravindra',  dept: 'CSE',   section: 'B', status: 'Late'    },
  { rollNumber: '105', name: 'KL Rahul',         dept: 'CSE',   section: 'C', status: 'Late'    },
  { rollNumber: '106', name: 'Bumrah Jasprit',   dept: 'CSE',   section: 'B', status: 'Present' },
  { rollNumber: '107', name: 'Pant Rishabh',     dept: 'CSE',   section: 'C', status: 'Absent'  },
  { rollNumber: '108', name: 'Iyer Shreyas',     dept: 'CSE',   section: 'A', status: 'Present' },
  { rollNumber: '109', name: 'Gill Shubman',     dept: 'CSE',   section: 'B', status: 'Present' },
  { rollNumber: '110', name: 'Siraj Mohammed',   dept: 'CSE',   section: 'C', status: 'Present' },
  { rollNumber: '201', name: 'Dube Shivam',      dept: 'ECE',   section: 'A', status: 'Present' },
  { rollNumber: '202', name: 'Yadav Kuldeep',    dept: 'ECE',   section: 'A', status: 'Absent'  },
  { rollNumber: '203', name: 'Chahal Yuzvendra', dept: 'ECE',   section: 'B', status: 'Present' },
  { rollNumber: '204', name: 'Donhi Suresh',     dept: 'ECE',   section: 'B', status: 'Absent'  },
  { rollNumber: '205', name: 'Thakur Shardul',   dept: 'ECE',   section: 'C', status: 'Late'    },
  { rollNumber: '206', name: 'Sundar Washington',dept: 'ECE',   section: 'A', status: 'Present' },
  { rollNumber: '207', name: 'Ashwin Ravi',      dept: 'ECE',   section: 'B', status: 'Present' },
  { rollNumber: '208', name: 'Shami Mohammed',   dept: 'ECE',   section: 'C', status: 'Present' },
  { rollNumber: '209', name: 'Karthik Dinesh',   dept: 'ECE',   section: 'A', status: 'Absent'  },
  { rollNumber: '210', name: 'Raina Suresh',     dept: 'ECE',   section: 'B', status: 'Present' },
  { rollNumber: '301', name: 'Tendulkar Sachin', dept: 'MECH',  section: 'A', status: 'Present' },
  { rollNumber: '302', name: 'Dravid Rahul',     dept: 'MECH',  section: 'A', status: 'Present' },
  { rollNumber: '303', name: 'Ganguly Sourav',   dept: 'MECH',  section: 'B', status: 'Late'    },
  { rollNumber: '304', name: 'Laxman VVS',       dept: 'MECH',  section: 'B', status: 'Present' },
  { rollNumber: '305', name: 'Kumble Anil',      dept: 'MECH',  section: 'C', status: 'Absent'  },
  { rollNumber: '306', name: 'Zaheer Khan',      dept: 'MECH',  section: 'C', status: 'Present' },
  { rollNumber: '307', name: 'Harbhajan Singh',  dept: 'MECH',  section: 'A', status: 'Present' },
  { rollNumber: '308', name: 'Sehwag Virender',  dept: 'MECH',  section: 'B', status: 'Absent'  },
  { rollNumber: '309', name: 'Yuvraj Singh',     dept: 'MECH',  section: 'C', status: 'Present' },
  { rollNumber: '310', name: 'Gambhir Gautam',   dept: 'MECH',  section: 'A', status: 'Late'    },
  { rollNumber: '401', name: 'Pandya Hardik',    dept: 'EEE',   section: 'A', status: 'Present' },
  { rollNumber: '402', name: 'Rohit Suresh',     dept: 'EEE',   section: 'B', status: 'Absent'  },
  { rollNumber: '403', name: 'Axar Patel',       dept: 'EEE',   section: 'C', status: 'Present' },
  { rollNumber: '404', name: 'Prithvi Shaw',     dept: 'EEE',   section: 'A', status: 'Late'    },
  { rollNumber: '405', name: 'Hanuma Vihari',    dept: 'EEE',   section: 'B', status: 'Present' },
  { rollNumber: '406', name: 'Mayank Agarwal',   dept: 'EEE',   section: 'C', status: 'Present' },
  { rollNumber: '407', name: 'Karun Nair',       dept: 'EEE',   section: 'A', status: 'Absent'  },
  { rollNumber: '408', name: 'Manish Pandey',    dept: 'EEE',   section: 'B', status: 'Present' },
  { rollNumber: '409', name: 'Ambati Rayudu',    dept: 'EEE',   section: 'C', status: 'Present' },
  { rollNumber: '410', name: 'Kedar Jadhav',     dept: 'EEE',   section: 'A', status: 'Late'    },
  { rollNumber: '501', name: 'Rohit Dube',       dept: 'IT',    section: 'A', status: 'Present' },
  { rollNumber: '502', name: 'Navdeep Saini',    dept: 'IT',    section: 'B', status: 'Absent'  },
  { rollNumber: '503', name: 'Deepak Chahar',    dept: 'IT',    section: 'C', status: 'Present' },
  { rollNumber: '504', name: 'T Natarajan',      dept: 'IT',    section: 'A', status: 'Present' },
  { rollNumber: '505', name: 'Rahul Tewatia',    dept: 'IT',    section: 'B', status: 'Late'    },
  { rollNumber: '506', name: 'Venkatesh Iyer',   dept: 'IT',    section: 'C', status: 'Present' },
  { rollNumber: '507', name: 'Arshdeep Singh',   dept: 'IT',    section: 'A', status: 'Absent'  },
  { rollNumber: '508', name: 'Avesh Khan',       dept: 'IT',    section: 'B', status: 'Present' },
  { rollNumber: '509', name: 'Harshal Patel',    dept: 'IT',    section: 'C', status: 'Present' },
  { rollNumber: '510', name: 'Ravi Bishnoi',     dept: 'IT',    section: 'A', status: 'Present' },
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

// Bump this whenever INITIAL_STUDENTS changes — forces localStorage to reset
const DATA_VERSION = 'v2'

function App() {
  const [students, setStudents] = useState(() => {
    const savedVersion = localStorage.getItem('attendance_version')
    const saved = localStorage.getItem('attendance_students')
    // If version mismatch or no data → load fresh initial data
    if (savedVersion !== DATA_VERSION || !saved) {
      localStorage.setItem('attendance_version', DATA_VERSION)
      return INITIAL_STUDENTS
    }
    return JSON.parse(saved)
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

  // Last registered student (for preview card below form)
  const [lastRegistered, setLastRegistered] = useState(null)

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('attendance_students', JSON.stringify(students))
  }, [students])

  // Theme State (default: 'light')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  // Sync theme attribute to documentElement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  const [showAdminMenu, setShowAdminMenu] = useState(false)

  // Edit modal state
  const [editStudent, setEditStudent] = useState(null)   // null = closed; object = student being edited
  const [editName, setEditName] = useState('')
  const [editDept, setEditDept] = useState(DEPARTMENTS[0])
  const [editSection, setEditSection] = useState(SECTIONS[0])
  const [editStatus, setEditStatus] = useState('Present')

  // Close administration hub menu when clicking outside
  useEffect(() => {
    if (!showAdminMenu) return
    const closeMenu = (e) => {
      if (!e.target.closest('.admin-menu-container')) {
        setShowAdminMenu(false)
      }
    }
    document.addEventListener('click', closeMenu)
    return () => document.removeEventListener('click', closeMenu)
  }, [showAdminMenu])

  const handleSignOut = () => {
    window.location.href = '/landing_page.html'
  }

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
    setLastRegistered(newStudent)
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

  // Open edit modal pre-filled with student data
  const handleEditStudent = (s) => {
    // Find full department name from short code
    const fullDept = Object.keys(DEPT_SHORT_MAP).find(k => DEPT_SHORT_MAP[k] === s.dept) || DEPARTMENTS[0]
    setEditStudent(s)
    setEditName(s.name)
    setEditDept(fullDept)
    setEditSection(s.section)
    setEditStatus(s.status)
  }

  // Save edited student
  const handleSaveEdit = () => {
    if (!editName.trim()) {
      showNotification('Student name cannot be empty!', 'error')
      return
    }
    setStudents(prev => prev.map(s =>
      s.rollNumber === editStudent.rollNumber
        ? { ...s, name: editName.trim(), dept: DEPT_SHORT_MAP[editDept] || editDept, section: editSection, status: editStatus }
        : s
    ))
    showNotification(`${editName.trim()} updated successfully!`, 'success')
    setEditStudent(null)
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
          <div className="header-actions">
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
            <div className="admin-menu-container">
              <button className="header-badge admin-btn" onClick={() => setShowAdminMenu(!showAdminMenu)} title="Administration Hub Menu">
                🏫 Administration Hub
              </button>
              {showAdminMenu && (
                <div className="admin-dropdown-menu">
                  <div className="admin-profile-section">
                    <div className="admin-avatar">AS</div>
                    <div className="admin-info-details">
                      <span className="admin-name">Prof.karthi</span>
                      <span className="admin-role">Head of Administration</span>
                      <span className="admin-email">karthi@masterclass.edu</span>
                    </div>
                  </div>
                  <div className="admin-dropdown-divider"></div>
                  <button className="admin-signout-btn" onClick={handleSignOut}>
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
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

      {/* Add Student Form — full width below stats */}
      <main className="portal-stack">

        {/* Add Student Form */}
        <section className="form-card">
          <div className="card-header-accent">
            <h3>📝 Add Student to Class</h3>
            <p>Enter details to append a new record</p>
          </div>

          <form onSubmit={handleAddStudent} className="student-form student-form-inline">
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
              <label>Status</label>
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

            <div className="form-group form-submit-col">
              <label>&nbsp;</label>
              <button type="submit" className="btn-submit">
                <span>➕ Add Student to </span>
              </button>
            </div>
          </form>
        </section>

        {/* Last Registered Student Preview */}
        {lastRegistered && (
          <div className="last-registered-card">
            <div className="lr-header">
              <span className="lr-label">✅ Last Registered</span>
              <button className="lr-close" onClick={() => setLastRegistered(null)} title="Dismiss">✕</button>
            </div>
            <div className="lr-body">
              <div className="lr-avatar">
                {lastRegistered.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="lr-details">
                <span className="lr-name">{lastRegistered.name}</span>
                <div className="lr-meta">
                  <span className="lr-badge">#{lastRegistered.rollNumber}</span>
                  <span className="lr-badge">{lastRegistered.dept}</span>
                  <span className="lr-badge">Sec {lastRegistered.section}</span>
                  <span className={`lr-status lr-status-${lastRegistered.status.toLowerCase()}`}>
                    {lastRegistered.status === 'Present' && '🟢'}
                    {lastRegistered.status === 'Absent' && '🔴'}
                    {lastRegistered.status === 'Late' && '🟡'}
                    {' '}{lastRegistered.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Roster Table — full width below form */}
        <section className="directory-card">

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
                      <td>
                        <div className="student-info-col">
                          <div className="avatar">
                            {getInitials(s.name)}
                          </div>
                          <div className="name-details">
                            <span className="student-name">{s.name}</span>
                          </div>
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
                          <span className="pill-dot">
                            {s.status === 'Present' && '🟢'}
                            {s.status === 'Absent' && '🔴'}
                            {s.status === 'Late' && '🟡'}
                          </span>
                          <span>{s.status}</span>
                        </span>
                      </td>
                      <td className="actions-col">
                        <button
                          onClick={() => handleEditStudent(s)}
                          className="btn-action-edit"
                          title="Edit student details"
                        >
                          ✏️
                        </button>
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

        </section>

      </main>
      </>
      )}

      {activeTab === 'grades' && <Grades />}
      {activeTab === 'courses' && <Courses />}

      {/* ── Edit Student Modal ── */}
      {editStudent && (
        <>
          <div className="edit-modal-overlay" onClick={() => setEditStudent(null)} />
          <div className="edit-modal">
            <div className="edit-modal-header">
              <h3>✏️ Edit Student</h3>
              <button className="edit-modal-close" onClick={() => setEditStudent(null)}>✕</button>
            </div>
            <div className="edit-modal-body">
              <div className="edit-field">
                <label>Roll Number</label>
                <input type="text" value={editStudent.rollNumber} disabled className="edit-input edit-input-disabled" />
              </div>
              <div className="edit-field">
                <label>Student Name</label>
                <input
                  type="text"
                  className="edit-input"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Full Name"
                />
              </div>
              <div className="edit-field">
                <label>Department</label>
                <select className="edit-input" value={editDept} onChange={e => setEditDept(e.target.value)}>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="edit-field">
                <label>Section</label>
                <select className="edit-input" value={editSection} onChange={e => setEditSection(e.target.value)}>
                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="edit-field">
                <label>Status</label>
                <select className="edit-input" value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                  <option value="Present">🟢 Present</option>
                  <option value="Absent">🔴 Absent</option>
                  <option value="Late">🟡 Late</option>
                </select>
              </div>
            </div>
            <div className="edit-modal-footer">
              <button className="edit-cancel-btn" onClick={() => setEditStudent(null)}>Cancel</button>
              <button className="edit-save-btn" onClick={handleSaveEdit}>💾 Save Changes</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App
