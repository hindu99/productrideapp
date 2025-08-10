import React, { useState } from 'react';
import SideBar from '../Sidebar/sidebar';        // importing sidebar component
import TopBar from '../PageTopBar/pagetopbar';   // importing the topbarcomponent
import './pagelayout.css';                       // importing the pagelayout.css

/* This React page created as a layout for all the screens on the app
   Layout takes sidebar, top bar and main conetent as children */
const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false); // track sidebar collapse

  return (
    <div className={`layout-container ${collapsed ? 'collapsed' : ''}`}>
      {/* Fixed full-width TopBar at the very top */}
      <TopBar />

      {/* Fixed Sidebar (left), rendered under the top bar */}
      <aside className="sidebar">
        <SideBar collapsed={collapsed} onToggle={setCollapsed} />
      </aside>

      {/* Right side: Main content (scrolls) */}
      <main className="content-area">
        {children} {/* This is where we will be adding our app page content */}
      </main>
    </div>
  );
};

export default Layout;
