// File: src/components/Sidebar.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faBook,
  faBookOpen,
  faSpinner,
  faClock,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { faAirbnb } from "@fortawesome/free-brands-svg-icons";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li>
          <a href="/dashboard"><FontAwesomeIcon icon={faHouse} /> <span>Dashboard</span></a>
        </li>
        <li>
          <a href="/mycourse"><FontAwesomeIcon icon={faBook} /> <span>My Courses</span></a>
        </li>
        <li>
          <a href="/roadmap"><FontAwesomeIcon icon={faBookOpen} /> <span>Roadmap</span></a>
        </li>
        <li>
          <a href="/progress"><FontAwesomeIcon icon={faSpinner} /> <span>Progress</span></a>
        </li>
        <li>
          <a href="/schedule"><FontAwesomeIcon icon={faClock} /> <span>Schedule</span></a>
        </li>
        <li>
          <a href="/resources"><FontAwesomeIcon icon={faFolderOpen} /> <span>Resources</span></a>
        </li>
        <li>
          <a href="/assistant"><FontAwesomeIcon icon={faAirbnb} /> <span>AI Assistant</span></a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
