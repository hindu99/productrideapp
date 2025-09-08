import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './sidebar.css';
import { getUserRole } from '../../HelperFunctions/tokendecoder';

/* Sidebar menu items */
const menuItems = [
  { name: 'Kanban Board', path: '/Board' },
  { name: 'Backlog', path: '/backlogtable' },
  { name: 'Add Requirement', path: '/requirementbox' },
  { name: 'Users', path: '/users' },
  { name: 'Admin', path: '/adminmainpage', role: 'admin' },
  { name: 'Logout', path: '/logout' }
];

/* SideMenu -> now named SideBar for consistency
   - Collapsible left navigation under the top bar
   - Uses React Router navigation (no full page reload) */
const SideBar = ({ collapsed = false, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // read role from your decoder
  let role = null;
  try {
    const raw = (typeof getUserRole === 'function' ? getUserRole() : null);
    role = typeof raw === 'string' ? raw.trim().toLowerCase() : null;
  } catch {
    role = null;
  }

  // SPA navigation helper
  const handleNavigation = (path) => {
    // If parent wants to track selection, it can still do that outside
    navigate(path); // no full reload
  };

  //This code is hiding admin ,if the user is not admin
  const visibleItems = menuItems.filter((item) => {
    if (!item.role) return true;
    return role === String(item.role).toLowerCase();
  });

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
        {visibleItems.map(({ name, path }) => {
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
