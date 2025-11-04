import React, { useState, useCallback } from 'react';
import Navbar from '../../components/Navbar'; 
import Sidebar from '../../components/Sidebar'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone
} from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

const Dashboard = () => {
  const [courses, setCourses] = useState([
    { id: 1, title: 'Pronunciation Mastery', progress: 47, status: '' },
    { id: 2, title: 'Pronunciation Mastery', progress: 47, status: 'Complete' },
    { id: 3, title: 'Pronunciation Mastery', progress: 47, status: '' }
  ]);

  const handleLoadMore = useCallback(() => {
    setCourses(prev => [...prev, { id: Date.now(), title: 'New Course', progress: 30, status: '' }]);
  }, []);

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="dashboard-main">
          {/* Dashboard Header */}
          <section className="dashboard-header">
            <div className="header-left">
              <h1>Dashboard</h1>
              <p>Track your learning journey with detailed stats and insights.</p>
            </div>
            <div className="header-right">
              <div className="learn-circle">
                <span className="learn-btn">LEARN</span>
              </div>
            </div>
          </section>

          {/* Progress Summary */}
          <section className="progress-summary">
            <div className="course-progress-card">
              <h3>Course Progress</h3>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '47%' }}></div>
              </div>
              <span className="progress-percent">47%</span>
            </div>
            <div className="daily-streak-card">
              <div className="streak-icon">⚡</div>
              <h3>Daily streak</h3>
              <span className="streak-number">2</span>
            </div>
          </section>

          {/* Courses List */}
          <section className="courses-section">
            <div className="courses-list">
              {courses.map(course => (
                <div key={course.id} className={`course-card ${course.status === 'Complete' ? 'complete' : ''}`}>
                  <div className="course-info">
                    <div className="course-icon">
                      <FontAwesomeIcon icon={faMicrophone} />
                    </div>
                    <div className="course-details">
                      <h4>Course</h4>
                      <p>{course.title}</p>
                      <div className="course-progress-bar">
                        <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                      </div>
                      <span className="course-percent">{course.progress}%</span>
                      {course.status && <span className="status complete">✓ Complete</span>}
                    </div>
                  </div>
                  <button className="continue-btn">Continue</button>
                </div>
              ))}
            </div>
            <button className="load-more-btn" onClick={handleLoadMore}>Load more</button>
          </section>

          {/* Skills Breakdown */}
          <section className="skills-breakdown">
            <h2>Skills breakdown</h2>
            <div className="skills-grid">
              <div className="skill-item listening">
                <h3>LISTENING</h3>
                <div className="circular-progress" style={{ background: 'conic-gradient(#EF4444 25%, #e5e7eb 0)' }}>
                  <div className="progress-inner"></div>
                </div>
                <span className="skill-percent">25%</span>
              </div>
              <div className="skill-item speaking">
                <h3>SPEAKING</h3>
                <div className="circular-progress" style={{ background: 'conic-gradient(#34D399 79%, #e5e7eb 0)' }}>
                  <div className="progress-inner"></div>
                </div>
                <span className="skill-percent">79%</span>
              </div>
              <div className="skill-item writing">
                <h3>WRITING</h3>
                <div className="circular-progress" style={{ background: 'conic-gradient(#F59E0B 52%, #e5e7eb 0)' }}>
                  <div className="progress-inner"></div>
                </div>
                <span className="skill-percent">52%</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
