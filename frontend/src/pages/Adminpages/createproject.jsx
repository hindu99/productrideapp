import React, { useState } from 'react';
import './createproject.css';
import { addToken } from '../../HelperFunctions/addtoken';
import Layout from "../../components/PageLayouts/pagelayout"; 

/*
  CreateProject component handles creation of new projects by admin.
*/
const CreateProject = () => {
  // State variables for form fields and errors
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [errors, setErrors] = useState([]); // For validation errors
  const [apiError, setApiError] = useState(''); // For API errors

  // Function to render error messages
  const renderErrors = () => {
    if (apiError) return <p>{apiError}</p>;
    if (errors.length > 0) {
      return (
        <ul>
          {errors.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      );
    }
    return null;
  };

  // Function to handle project creation form submission
  const handleCreateProject = async (e) => {
    e.preventDefault();

    // Basic validation
    const validationErrors = [];
    if (!projectName) validationErrors.push('Please enter the project name');
    if (!projectDescription) validationErrors.push('Please enter the project description');

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setApiError('');
      return;
    }

    setErrors([]); // Clear previous errors
    setApiError(''); // Clear previous API error

    // Prepare project details to be send to backend
    const projectDetails = {
      projectname: projectName,
      projectdescription: projectDescription,
    };

    // Make POST request to backend for registering project
    try {
      const response = await fetch('http://localhost:5000/api/createproject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...addToken(), // Add JWT token from helper to add token info
        },
        body: JSON.stringify(projectDetails),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Project created successfully!');
        setProjectName('');
        setProjectDescription('');
      } else {
        setApiError(data.message || 'Project creation failed. Please try again.');
      }
    } catch {
      setApiError('An error occurred while creating the project. Please contact your administrator.');
    }
  };

  // Project creation form UI,renders the project creation form 
  return (
    <Layout>
    <div className="projectregistration-container">
      {/*<img
        className="logo"
        src="/src/assets/Logo/product_ride_compact.png"
        alt="Product Logo"
      />*/}
      <h2>Create New Project</h2>
      <form className="ProjectRegistration-form" onSubmit={handleCreateProject}>
        {/* Project Name */}
        <label htmlFor="projectName">Project Name:</label>
        <input
          type="text"
          name="projectName"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />

        {/* Project Description */}
        <label htmlFor="projectDescription">Project Description:</label>
        <textarea
          name="projectDescription"
          placeholder="Enter project description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          required
        />

        {/* Display error message if any */}
        <div className="error-message">{renderErrors()}</div>

        {/* Submit button */}
        <button type="submit">Create Project</button>
      </form>
    </div>
    </Layout>
  );
};

export default CreateProject;
