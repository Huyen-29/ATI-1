import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouse, faBook, faBookOpen, faSpinner, faClock, faFolderOpen,
  faHeadphones, faMicrophone, faPen
} from '@fortawesome/free-solid-svg-icons';
import { faAirbnb } from '@fortawesome/free-brands-svg-icons';
import '../Homepage/Homepage.css';

const Homepage = () => {
  return (
    <div>
      <header>
        <div className="logo">
          <img src="/assets/images/Logo.png" alt="E-Master Logo" />
          <span className="brand-name">E-Master</span>
        </div>
        <nav>
          <select className="exam-select">
            <option>IELTS</option>
            <option>TOEIC</option>
          </select>
          <a href="#">Building a road map</a>
          <a href="#">Input Testing</a>
          <a href="#">Practice Test</a>
        </nav>
        <div className="auth-buttons">
          <button className="signup">Sign up</button>
          <button className="signin">Sign in</button>
        </div>
      </header>
      <aside className="sidebar">
        <ul>
          <li><a href="/dashboard"><FontAwesomeIcon icon={faHouse} /> Dashboard</a></li>
          <li><a href="/mycourse"><FontAwesomeIcon icon={faBook} /> My courses</a></li>
          <li><a href="/roadmap"><FontAwesomeIcon icon={faBookOpen} /> Roadmap</a></li>
          <li><a href="/progress"><FontAwesomeIcon icon={faSpinner} /> Progress</a></li>
          <li><a href="/schedule"><FontAwesomeIcon icon={faClock} /> Schedule</a></li>
          <li><a href="/resources"><FontAwesomeIcon icon={faFolderOpen} /> Resources</a></li>
          <li><a href="/assistant"><FontAwesomeIcon icon={faAirbnb} /> AI Assistant</a></li>
        </ul>
      </aside>
      <main className="main-content">
        <section className="hero">
          <div className="text">
            <h1>Comprehensive <br />IELTS/TOEIC Study & Practice Roadmap</h1>
            <p>Master English step by step with a clear roadmap tailored for IELTS & TOEIC success. Boost your skills with proven strategies and practice materials designed to help you achieve your goals.</p>
            <button className="start-btn">Start Now ▶</button>
            <div className="rating">
              <img src="/assets/images/student-icon.png" alt="students" className="student-icon" />
              <p>4,359 <br /><span>Study IELTS at E-Master</span></p>
              <div className="stars">⭐ 4.8/5</div>
            </div>
          </div>
          <div className="image">
            <img src="/assets/images/homepage3.png" alt="Hero image" />
          </div>
        </section>
        <section className="features">
          <h2>Why Our IELTS/TOEIC Learning Platform Works for You?</h2>
          <button className="explore-btn">Explore All Features</button>
          <div className="feature-grid">
            <div className="feature-card">
              <img src="/assets/images/book.svg" alt="Personalized Learning" />
              <h3>Personalized Learning</h3>
              <p>Get a customized study plan that adapts to your level, pace, and goals — so you learn smarter, not harder.</p>
            </div>
            <div className="feature-card">
              <img src="/assets/images/Component 1.svg" alt="IELTS/TOEFL Preparation" />
              <h3>IELTS/TOEFL Preparation</h3>
              <p>Master international exams with structured practice, proven strategies, and expert guidance.</p>
            </div>
            <div className="feature-card">
              <img src="/assets/images/Vector.svg" alt="AI-Powered Support" />
              <h3>AI-Powered Support</h3>
              <p>Instant, personalized assistance from AI tools to help you stay on track and improve faster.</p>
            </div>
            <div className="feature-card">
              <img src="/assets/images/clock.svg" alt="Flexible Schedule" />
              <h3>Flexible Schedule</h3>
              <p>Study anytime, anywhere. Your learning fits around your life, not the other way around.</p>
            </div>
            <div className="feature-card">
              <img src="/assets/images/Component 2.svg" alt="Learning Community" />
              <h3>Learning Community</h3>
              <p>Join a vibrant community of learners to practice, share experiences, and stay motivated together.</p>
            </div>
            <div className="feature-card">
              <img src="/assets/images/bookmark-2.svg" alt="Progress Tracking" />
              <h3>Progress Tracking</h3>
              <p>Track your progress with detailed reports and actionable feedback to keep improving every day.</p>
            </div>
          </div>
        </section>
        <section className="skills">
          <div className="skill-card blue">
            <h3><FontAwesomeIcon icon={faHeadphones} /> Listening</h3>
            <p>Master IELTS listening with authentic audio materials and practice tests</p>
            <b>Key Topics:</b>
            <ul>
              <li>Academic Lectures</li>
              <li>Conversations</li>
              <li>Monologues</li>
              <li>Note-taking Skills</li>
            </ul>
            <button>Start learning</button>
          </div>
          <div className="skill-card green">
            <h3><FontAwesomeIcon icon={faBook} /> Reading</h3>
            <p>Improve reading comprehension and speed with diverse academic texts</p>
            <b>Key Topics:</b>
            <ul>
              <li>Academic Texts</li>
              <li>Skimming & Scanning</li>
              <li>Question Types</li>
              <li>Time Management</li>
            </ul>
            <button>Start learning</button>
          </div>
          <div className="skill-card orange">
            <h3><FontAwesomeIcon icon={faMicrophone} /> Speaking</h3>
            <p>Build confidence in speaking with interactive practice sessions</p>
            <b>Key Topics:</b>
            <ul>
              <li>Part 1 Interview</li>
              <li>Part 2 Long Turn</li>
              <li>Part 3 Discussion</li>
              <li>Pronunciation</li>
            </ul>
            <button>Start learning</button>
          </div>
          <div className="skill-card purple">
            <h3><FontAwesomeIcon icon={faPen} /> Writing</h3>
            <p>Learn to write clear, well-structured essays and reports</p>
            <b>Key Topics:</b>
            <ul>
              <li>Task 1 Reports</li>
              <li>Task 2 Essays</li>
              <li>Grammar & Vocabulary</li>
              <li>Band Score Criteria</li>
            </ul>
            <button>Start learning</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;