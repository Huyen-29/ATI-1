// File: src/components/Navbar.jsx
import React from "react";
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import { Link } from 'react-router-dom';
import "./Navbar.css";

const Navbar = () => {
  return (
    <header className="navbar">
      {/* Logo và thương hiệu */}
      <div className="navbar-left">
        <Link to="/landing" className="navbar-home-link">
          {/* apply both sets of classes so homepage/landing styles (logo-img/logo-text) and navbar styles both apply */}
          <img src="/assets/images/Logo.png" alt="Logo" className="logo-img navbar-logo" />
          <span className="logo-text navbar-brand">E-Master</span>
        </Link>
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
