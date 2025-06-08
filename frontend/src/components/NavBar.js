import React from 'react';
import { Link } from 'react-router-dom';

function NavBar({ role, onLogout }) {
  const buttonStyle = {
    padding: '6px 12px',
    margin: '0 8px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
    display: 'inline-block'
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3'
  };

  const logoutButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    margin: '0'
  };

  return (
    <nav style={{
      margin: '1rem 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link to="/dashboard" style={buttonStyle}>Dashboard</Link>
        <Link to="/map" style={buttonStyle}>Map</Link>
        <Link to="/shelters" style={buttonStyle}>Shelters</Link>
        <Link to="/alerts" style={buttonStyle}>Alerts</Link>

        {/* Show Reports only for Admin */}
        {role === 'Admin' && (
          <Link to="/reports" style={buttonStyle}>Reports</Link>
        )}
      </div>

      {/* Logout button aligned to the right */}
      <Link to="/" onClick={onLogout} style={logoutButtonStyle}>
        Logout
      </Link>
    </nav>
  );
}

export default NavBar;