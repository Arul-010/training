import React from 'react';
import '../App.css';

const Grades = () => {
  return (
    <div className="module-container">
      <h2 className="module-title">Grades Management</h2>
      <p className="module-desc">This module is under development. Here you will be able to manage student marks, generate report cards, and view class performance.</p>
      
      <div className="stat-card" style={{ marginTop: '30px' }}>
        <div className="stat-icon">📝</div>
        <div className="stat-info">
          <span className="stat-label">Upcoming Feature</span>
          <span className="stat-val">Exam Reports</span>
        </div>
      </div>
    </div>
  );
};

export default Grades;
