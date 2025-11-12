import React from 'react';
import './Logout.css';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    // go back to previous page
    navigate(-1);
  };

  const handleLogout = () => {
    // perform simple logout actions: clear local token (if any), show success message and navigate to login
    try {
      localStorage.removeItem('token');
    } catch (e) {
      // ignore
    }
    // show confirmation to the user
    // navigate to logout success page
    navigate('/logout/success');
  };

  return (
    <div className="logout-card">
      <div className="icon-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </div>
      <h2 className="logout-title">Log Out</h2>
      <p className="logout-text">Are you sure you want to sign out of your account?</p>
      <div className="button-container">
        <button
          onClick={handleCancel}
          className="logout-button cancel-button"
          aria-label="Cancel logout"
        >
          Cancel
        </button>
        <button
          onClick={handleLogout}
          className="logout-button confirm-button"
          aria-label="Confirm logout"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Logout;
