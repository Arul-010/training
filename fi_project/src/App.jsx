import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EmployeeProvider } from './context/EmployeeContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import EmployeeList from './pages/EmployeeList/EmployeeList';
import EmployeeDetails from './pages/EmployeeDetails/EmployeeDetails';
import EmployeeForm from './pages/EmployeeForm/EmployeeForm';
import NotFound from './pages/NotFound/NotFound';
import ToastContainer from './components/Feedback/Toast';
import ConfirmationModal from './components/Feedback/ConfirmationModal';

function App() {
  return (
    <EmployeeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Default redirect to Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard View */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Employee Views */}
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/new" element={<EmployeeForm />} />
            <Route path="/employees/:id" element={<EmployeeDetails />} />
            <Route path="/employees/edit/:id" element={<EmployeeForm />} />
            
            {/* 404 Fallback View */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        {/* Global Feedback Components */}
        <ToastContainer />
        <ConfirmationModal />
      </BrowserRouter>
    </EmployeeProvider>
  );
}
export default App;
