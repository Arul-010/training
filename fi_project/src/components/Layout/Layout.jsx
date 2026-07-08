import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

// Width of the hot-zone at the left edge that triggers the sidebar (px)
const EDGE_TRIGGER_ZONE = 10;

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarOpenRef = useRef(sidebarOpen);
  sidebarOpenRef.current = sidebarOpen;

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const sidebarWidth = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width') || '260',
        10
      );

      if (e.clientX <= EDGE_TRIGGER_ZONE) {
        // Mouse hit the left edge → open sidebar
        if (!sidebarOpenRef.current) {
          setSidebarOpen(true);
        }
      } else if (e.clientX > sidebarWidth + 20) {
        // Mouse moved well past the sidebar → close it
        if (sidebarOpenRef.current) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

