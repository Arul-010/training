import React from 'react';
import '../App.css';

const Courses = () => {
  return (
    <div className="module-container">
      <h2 className="module-title">Courses & Curriculum</h2>
      <p className="module-desc">This module is under development. Here you will be able to manage course syllabi, assign professors, and view schedules.</p>
      
      <div className="stat-card" style={{ marginTop: '30px' }}>
        <div className="stat-icon">📚</div>
        <div className="stat-info">
          <span className="stat-label">Upcoming Feature</span>
          <span className="stat-val">Syllabus Mapping</span>
        </div>
      </div>
    </div>
  );
};

export default Courses;
