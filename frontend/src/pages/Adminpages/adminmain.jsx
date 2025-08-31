import React from 'react';
import { useNavigate } from 'react-router-dom';
import './adminmain.css';
import Layout from "../../components/PageLayouts/pagelayout"; 

// Adminmainpage component: Admin users use this to create users ,create projects and varipus other admin tasks 
const Adminmainpage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
    <div className="dashboard-container">
      {/* Navigation buttons for admin actions */}
      <button onClick={() => navigate('/createnonadminuser')}>Create User</button>
      <button onClick={() => navigate('/createproject')}>Create Project</button>
      <button onClick={() => navigate('/a')}>A</button>
      <button onClick={() => navigate('/b')}>B</button>
    </div>
    </Layout>
  );
};

export default Adminmainpage;
