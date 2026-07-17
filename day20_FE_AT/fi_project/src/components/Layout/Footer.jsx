import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-inner">
        {/* Left — Branding */}
        <div className="footer-brand">
          <span className="footer-logo">💼 ASD corp</span>
          <p className="footer-tagline">
            Built with <FiHeart className="footer-heart" /> for modern HR teams
          </p>
        </div>

        {/* Centre — Quick Links */}
        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/dashboard" className="footer-link">Dashboard</Link>
          <span className="footer-sep">·</span>
          <Link to="/employees" className="footer-link">Employees</Link>
          <span className="footer-sep">·</span>
          <Link to="/employees/new" className="footer-link">Add Employee</Link>
        </nav>

        {/* Right — Copyright */}
        <p className="footer-copy">
          &copy; {year} ASD corp. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
