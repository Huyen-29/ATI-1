// File: src/components/Navbar.jsx
import React from "react";
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header className="navbar">
      {/* Logo và thương hiệu */}
      <div className="navbar-left">
        <img src="/assets/images/Logo.png" alt="Logo" className="navbar-logo" />
        <span className="navbar-brand">E-Master</span>
      </div>

      {/* Menu giữa */}
      <div className="navbar-center">
        <select className="exam-select">
          <option>IELTS</option>
          <option>TOEIC</option>
        </select>
        <a href="#" className="nav-link">Building a road map</a>
        <a href="#" className="nav-link">Input Testing</a>
        <a href="#" className="nav-link">Practice Test</a>
      </div>

      {/* Nút bên phải */}
      <div className="navbar-right">
        <FaBell className="icon bell" />
        <FaUserCircle className="icon user" />
        <FaBars className="icon menu" />
      </div>
    </header>
  );
};

export default Navbar;
