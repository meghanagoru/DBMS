// NavigationBar.js

import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
const NavigationBar = ({ isLoggedIn, handleLogout }) => {
  return (
    <nav>
      <Link to="/">Home</Link>
      {isLoggedIn && (
        <div>
          <Link to="/profile">Profile</Link>
          <Link to="/payment">Payment</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default NavigationBar;