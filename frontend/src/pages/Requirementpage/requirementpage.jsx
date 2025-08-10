import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from "../../components/PageLayouts/pagelayout"; // check filename casing
import './requirementpage.css';

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
  const [status, setStatus] = useState('In Backlog');

  // RICE (store as strings; convert on submit)
  const [reach, setReach] = useState('');
  const [impact, setImpact] = useState('');
  const [confidence, setConfidence] = useState('');
  const [effort, setEffort] = useState('');

  const [area, setArea] = useState('');

  // For error display
  const [apiError, setApiError] = useState(null);

  const handleSave = async () => {
    const payload = {
      title,
      requirements,
      acceptanceCriteria: acceptanceCriteriaText,
      sprint,
      assignee,
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Go home (router-friendly)
        navigate('/');
      } else {
        setApiError(data.message || 'Something went wrong, please try again.');
      }
    } catch (err) {
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
              <option value="Dev1">Dev1</option>
              <option value="Dev2">Dev2</option>
              <option value="Tester1">Tester1</option>
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
