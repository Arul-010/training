import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EmployeeProvider, useEmployees } from './context/EmployeeContext';
import { ProjectProvider } from './context/ProjectContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import EmployeeList from './pages/EmployeeList/EmployeeList';
import EmployeeDetails from './pages/EmployeeDetails/EmployeeDetails';
import EmployeeForm from './pages/EmployeeForm/EmployeeForm';
import Projects from './pages/Projects/Projects';
import Queries from './pages/Queries/Queries';
import EmployeePortal from './pages/EmployeePortal/EmployeePortal';
import Login from './pages/Login/Login';
import NotFound from './pages/NotFound/NotFound';
import ToastContainer from './components/Feedback/Toast';
import ConfirmationModal from './components/Feedback/ConfirmationModal';

function AppContent() {
  const { currentUser } = useEmployees();

  // If not logged in, render only the Login Screen (no Sidebar/Header layout wrapper)
  if (!currentUser) {
    return (
      <>
        <Login />
        <ToastContainer />
      </>
    );
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {isAdmin ? (
            <>
              {/* Default redirect to Dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Dashboard View */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Employee Views */}
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/employees/new" element={<EmployeeForm />} />
              <Route path="/employees/:id" element={<EmployeeDetails />} />
              <Route path="/employees/edit/:id" element={<EmployeeForm />} />
              
              {/* Projects View */}
              <Route path="/projects" element={<Projects />} />

              {/* Queries/Tickets View */}
              <Route path="/queries" element={<Queries />} />
            </>
          ) : (
            <>
              {/* Employees only see portal */}
              <Route path="/" element={<Navigate to="/portal" replace />} />
              <Route path="/dashboard" element={<Navigate to="/portal" replace />} />
              <Route path="/portal" element={<EmployeePortal />} />
            </>
          )}

          {/* 404 Fallback View */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      {/* Global Feedback Components */}
      <ToastContainer />
      <ConfirmationModal />
    </BrowserRouter>
  );
}

function App() {
  return (
    <EmployeeProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </EmployeeProvider>
  );
}
export default App;
