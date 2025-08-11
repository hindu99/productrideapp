import React from 'react';
import { useNavigate } from 'react-router-dom';
import './adminmain.css';

// Adminmainpage component: Admin users use this to create users ,create projects and varipus other admin tasks 
const Adminmainpage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Navigation buttons for admin actions */}
      <button onClick={() => navigate('/createnonadminuser')}>Create User</button>
      <button onClick={() => navigate('/create-project')}>Create Project</button>
      <button onClick={() => navigate('/a')}>A</button>
      <button onClick={() => navigate('/b')}>B</button>
    </div>
  );
};

export default Adminmainpage;
