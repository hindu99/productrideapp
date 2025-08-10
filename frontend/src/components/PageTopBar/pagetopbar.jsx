import React from 'react';
import './pagetopbar.css'; // CSS file import

// Top bar is used in the page layput for most of the app screens.
const TopBar = () => {
  return (
    // Header bar container with custom CSS class
    <header className="topbar" role="banner">
      {/* Logo or Brand section */}
      <div className="topbar-logo">
        <img src="/src/assets/Logo/product_ride_compact.png" alt="Product Logo" className="topbar-logo-img" />
      </div>

      {/* Right side: actions such as Docs, Support, and Profile */}
      <div className="topbar-actions">
        {/* Navigation button for Docs */}
        <button className="topbar-button">Docs</button>
        {/* Navigation button for Support */}
        <button className="topbar-button">Support</button>

        {/* Profile circle with user initial */}
        <div className="topbar-profile" aria-label="User profile">
          U
        </div>
      </div>
    </header>
  );
};

export default TopBar;
