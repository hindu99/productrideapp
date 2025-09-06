// pages/RequirementPage/requirementpage.jsx
// This file contains React component code for the Requirement Page.
// The Requirement Page is used to display and manage requirements for a project.
// It typically includes a form for entering requirements, a details panel, and may use state and effect hooks.

import React, { useState, useEffect } from 'react';  
import { useLocation, useNavigate, useParams } from 'react-router-dom'; 
import Layout from "../../components/PageLayouts/pagelayout"; 
import './requirementpage.css';
import { addToken } from '../../HelperFunctions/addtoken';
import ProjectSelect from "../../components/SelectionDropdowns/projectselector.jsx";

/*
  Requirements screen: confirm title/requirement/acceptance criteria
  and set metadata like assignee, RICE, etc.
*/

const RequirementsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();                 // reading :id from route
//  const isEditing = Boolean(id);              // derived state

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

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/findusers', {
          method: 'GET',
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

  // Fetch requirement details when an :id is present (card click)
  //When a card is clicked using the Id this part of code is making a request to the server to get the relavant requirement from database
  useEffect(() => {
    if (!id) return;
    const fetchRequirement = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/requirements/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...addToken(),
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || 'Failed to load requirement');

        // Prefill form (ensure string values for controlled inputs)
        setTitle(data.title ?? '');
        setRequirements(data.requirements ?? '');
        setAcceptanceCriteriaText(data.acceptanceCriteria ?? '');
        setSprint(data.sprint ?? '');
        setAssignee(data.assignee != null ? String(data.assignee) : '');
        setProject(data.project != null ? String(data.project) : '');
        setStatus(data.status ?? 'In Backlog');
        setReach(data.reach != null ? String(data.reach) : '');
        setImpact(data.impact != null ? String(data.impact) : '');
        setConfidence(data.confidence != null ? String(data.confidence) : '');
        setEffort(data.effort != null ? String(data.effort) : '');
        setArea(data.area ?? '');
      } catch (err) {
        setApiError(err.message);
      }
    };
    fetchRequirement();
  }, [id]);

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
            <input type="text" value={sprint} onChange={(e)=>setSprint(e.target.value)} className="title-input" />
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
            <ProjectSelect value={project} onChange={setProject} />
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
          <div className="input-group">
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
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default RequirementsPage;
