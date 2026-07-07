import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-layout-wrapper">
      {/* Sidebar Frame */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="app-main-container">
        {/* Navigation Header */}
        <Navbar toggleSidebar={toggleSidebar} />

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
