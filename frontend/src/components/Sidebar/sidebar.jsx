import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './sidebar.css';

/* Sidebar menu items */
const menuItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Requirement Box', path: '/requirementbox' },
  { name: 'Product List', path: '/products' },
  { name: 'Users', path: '/users' },
  { name: 'Settings', path: '/settings' },
  { name: 'Logout', path: '/logout' }
];

/* SideMenu -> now named SideBar for consistency
   - Collapsible left navigation under the top bar
   - Uses React Router navigation (no full page reload) */
const SideBar = ({ collapsed = false, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // SPA navigation helper
  const handleNavigation = (path) => {
    // If parent wants to track selection, it can still do that outside
    navigate(path); // no full reload
  };

  return (
    <div className={`side-menu ${collapsed ? 'collapsed' : 'open'}`}>
      {/* Toggle button for sidebar collapse/expand */}
      <button
        className="toggle-btn"
        onClick={() => onToggle && onToggle(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        {collapsed ? '>' : '<'}
      </button>

      {/* Sidebar menu list */}
      <ul className="menu-list">
        {menuItems.map(({ name, path }) => {
          const isActive = location.pathname === path;
          return (
            <li
              key={name}
              className={`menu-item ${isActive ? 'active' : ''} ${collapsed ? 'rail' : ''}`}
              onClick={() => handleNavigation(path)}
              title={name}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigation(path)}
            >
              {/* When collapsed, show first letter as a rail label */}
              {collapsed ? name[0] : name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideBar;
