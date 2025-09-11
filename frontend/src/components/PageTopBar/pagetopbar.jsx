import React from 'react';
import './pagetopbar.css'; // CSS file import
import { handleLogout } from '../Logout/logout';

const TopBar = () => {


  return (
    <header className="topbar" role="banner">
      {/* Logo or Brand section */}
      <div className="topbar-logo">
        <img
          src="/src/assets/Logo/product_ride_compact.png"
          alt="Product Logo"
          className="topbar-logo-img"
        />
      </div>

      {/* Top bar right side corner */}
      <div className="topbar-actions">
       

        {/* Logout button */}
        <button className="topbar-button" onClick={handleLogout}>
          Logout
        </button>

        {/* Profile circle with user initial */}
        <div className="topbar-profile" aria-label="User profile">
          U
        </div>
      </div>
    </header>
  );
};

export default TopBar;
