// This file contains React component code for the Requirement Page.
// The Requirement Page is used to display and manage requirements for a project.
// It typically includes a form for entering requirements, a details panel, and may use state and effect hooks.


import React, { useState, useEffect } from 'react';  // added useEffect
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from "../../components/PageLayouts/pagelayout"; 
import './requirementpage.css';
import { addToken } from '../../HelperFunctions/addtoken';

/*
  Requirements screen: confirm title/requirement/acceptance criteria
  and set metadata like assignee, RICE, etc.
*/

const RequirementsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { requirement, acceptanceCriteria } = location.state || {};

  // Form state
  const [title, setTitle] = useState('');
  const [requirements, setRequirements] = useState(requirement || '');
  const [acceptanceCriteriaText, setAcceptanceCriteriaText] = useState(acceptanceCriteria || '');

  const [sprint, setSprint] = useState('');
  const [assignee, setAssignee] = useState('');
  const [project, setProject] = useState('');
  const [status, setStatus] = useState('In Backlog');

  // RICE (store as strings; convert on submit)
  const [reach, setReach] = useState('');
  const [impact, setImpact] = useState('');
  const [confidence, setConfidence] = useState('');
  const [effort, setEffort] = useState('');

  const [area, setArea] = useState('');

  // For error display
  const [apiError, setApiError] = useState(null);

  // New state to hold users list
  const [users, setUsers] = useState([]);

  // New state to hold projects list
  const [projects, setProjects] = useState([]);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/findusers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            //Using the function from helper function "addtoken.js" below, we are adding the JWT token to the request 
            ...addToken(), 
          },
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        console.log('Fetched users:', data);

        setUsers(data);
      } catch {
        setApiError('Could not load users. Please try again later.');
      }
    };
    fetchUsers();

  }, []);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/findprojects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            //Using the function from helper function "addtoken.js" below, we are adding the JWT token to the request 
            ...addToken(), 
          },
        });
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        console.log('Fetched projects:', data);

        setProjects(data);
      } catch {
        setApiError('Could not load projects. Please try again later.');
      }
    };
    fetchProjects();

  }, []);

  const handleSave = async () => {
    const payload = {
      title,
      requirements,
      acceptanceCriteria: acceptanceCriteriaText,
      sprint,
      assignee,
      project,
      status,
      reach: Number(reach || 0),
      impact: Number(impact || 0),
      confidence: Number(confidence || 0),
      effort: Number(effort || 0),
      area,
    };

    try {
      const response = await fetch('http://localhost:5000/api/requirementdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...addToken(), // Spread token headers here inside headers object
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Go home (router-friendly)
        alert('Requirement added successfully')
        navigate('/requirementpage');
      } else {
        setApiError(data.message || 'Something went wrong, please try again.');
      }
    } catch {
      setApiError('An error occurred while adding the requirement. Please contact your administrator.');
    }
  };

  const handleEdit = () => {
    console.log('Edit clicked');
  };

  return (
    <Layout>
      <div className="requirements-container">
        {/* ===== Left container: details panel ===== */}
        <aside className="req-side-panel" aria-label="Requirement details">
          <div className="input-group">
            <label className="input-label">Sprint</label>
            <input type="text" value={sprint} readOnly className="title-input" />
          </div>

          <div className="input-group">
            <label className="input-label">Assignee</label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="title-input"
            >
              <option value="">Unassigned</option>
              {users.map(user => (
                <option key={user.user_id} value={user.user_id}>
                  {user.fullname}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Project</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="title-input"
            >
              <option value="">Unassigned</option>
              {projects.map(proj => (
                <option key={proj.project_id} value={proj.project_id}>
                  {proj.project_name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="title-input"
            >
              <option value="In Backlog">In Backlog</option>
              <option value="In Development">In Development</option>
              <option value="In Test">In Test</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* ---- RICE Scoring ---- */}
          <div className="input-group">
            <label className="input-label">Reach</label>
            <input
              type="number"
              value={reach}
              onChange={(e) => setReach(e.target.value)}
              className="title-input"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Impact</label>
            <input
              type="number"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              className="title-input"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Confidence</label>
            <input
              type="number"
              value={confidence}
              onChange={(e) => setConfidence(e.target.value)}
              className="title-input"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Effort</label>
            <input
              type="number"
              value={effort}
              onChange={(e) => setEffort(e.target.value)}
              className="title-input"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Area</label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="title-input"
            />
          </div>

          <div className="input-group">
            <button className="save-btn" onClick={handleSave}>Approve &amp; Save</button>
            <button className="edit-btn" onClick={handleEdit}>Edit</button>
          </div>

          {apiError && <div className="error-text">{apiError}</div>}
        </aside>

        {/* ===== Right container: main form ===== */}
        <section className="req-main-panel">
       <div className="input-group">*
            <label className="input-label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="title-input"
              placeholder="Add a concise, action-oriented title"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Requirements</label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="chatgpt-textarea"
              placeholder="Describe the requirement in detail"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Acceptance Criteria</label>
            <textarea
              value={acceptanceCriteriaText}
              onChange={(e) => setAcceptanceCriteriaText(e.target.value)}
              className="chatgpt-textarea"
              placeholder="List clear, testable acceptance criteria"
            />
         // </div>
        </section>
      </div>
    </Layout>
  );
};

export default RequirementsPage;
