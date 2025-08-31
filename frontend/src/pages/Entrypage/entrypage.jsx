import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectSelect from '../../components/SelectionDropdowns/projectselector.jsx';
import Layout from "../../components/PageLayouts/pagelayout";
import './entrypage.css';

// Key name for storing selected project in localStorage
const localstoragekey = 'selectedProjectId';

export default function EntryPage() {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState('');

  // This effect runs once on mount
  // It checks if there’s already a saved projectId in localStorage
  // If found,restored it into state so the dropdown is preselected
  useEffect(() => {
    const savedProjectId = localStorage.getItem(localstoragekey);
    if (savedProjectId) setProjectId(savedProjectId);
  }, []);

  // Called whenever user selects a project in the dropdown
  // Saves both into component state and into localStorage (persistent)
  const handleProjectSelection = (value) => {
    setProjectId(value);
    localStorage.setItem(localstoragekey, value || '');
  };

  // Continue button will redirect to board 
  const handleContinue = () => {
    navigate('/Board');
  };

  return (
    <Layout>
      <div className="entry-wrap">
        <div className="entry-card">
          {/* Page heading */}
          <h1 className="entry-title">Select a Project</h1>
         
          {/* Project dropdown field */}
          <div className="entry-field">
            {/* Label tied to the dropdown for accessibility */}
            <label className="entry-label" htmlFor="project-select">Project</label>
            {/* ProjectSelect component handles fetching + rendering options */}
            <ProjectSelect
              id="project-select"
              value={projectId}
              onChange={handleProjectSelection}
            />
          </div>

          {/* Action buttons */}
          <div className="entry-actions">
            <button
              className="entry-btn"
              onClick={handleContinue}
              disabled={!projectId} // disable until user selects a project
              title={projectId ? 'Continue' : 'Please select a project first'}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
