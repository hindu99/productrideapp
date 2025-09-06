// ProjectSelect Dropdown Component
// A reusable dropdown for selecting a project.
// Fetches available projects from the backend API and displays them as options.
// Shows loading and error states. Used in forms where a project selection is required.

import React, { useEffect, useState } from 'react';
import { addToken } from '../../HelperFunctions/addtoken';

export default function ProjectSelect({ value, onChange }) {
  // State for project list, loading, and error
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch projects from backend API on mount
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/findprojects', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...addToken(),
          },
        });

        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data);
      } catch  {
        setError('Could not load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Render the dropdown with loading, error, and project options
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="title-input"
    >
      <option value="">
        {loading ? 'Loading...' : error ? error : 'Unassigned'}
      </option>
      {projects.map((proj) => (
        <option key={proj.project_id} value={proj.project_id}>
          {proj.project_name}
        </option>
      ))}
    </select>
  );
}
