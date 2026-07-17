import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('ems_sidebar_pinned');
    return saved === 'true';
  });

  const toggleSidebar = () => {
    setSidebarOpen(prev => {
      const next = !prev;
      localStorage.setItem('ems_sidebar_pinned', String(next));
      return next;
    });
  };

  return (
    <div className={`app-layout-wrapper ${sidebarOpen ? 'sidebar-pinned' : ''}`}>
      {/* Sidebar Frame */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="app-main-container">
        {/* Navigation Header */}
        <Navbar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Dynamic Route Content */}
        <main className="app-content-body fade-in">
          <div className="content-container">
            {children}
          </div>
        </main>

        {/* Site Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

