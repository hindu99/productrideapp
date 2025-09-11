import React, { useState } from 'react';
import './createuser.css';
import { addToken } from '../../HelperFunctions/addtoken';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;


/*CreateUser component handles user creation by admin,In the system only admins can be created via siguppage 
rest of the users has to be created by admin.This function does that*/
const CreateUser = () => {
  const navigate = useNavigate();
  // State variables for form fields and error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState([]); // For validation errors,"error" term is used 
  const [apiError, setApiError] = useState(''); // For API/server errors

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

  // Function to handle usercreation form submission
const handleCreateUser = async (e) => {
  
  e.preventDefault();
  // Basic validation
  const validationErrors = [];
  if (!email) validationErrors.push('Please enter the email');
  if (!password) validationErrors.push('Please enter password');

  if (validationErrors.length > 0) {
    setErrors(validationErrors);
    setApiError('');
    return;
  }
  setErrors([]); // clear previous errors
  setApiError(''); // clear previous API error

  // Prepare user details
  const userdetails = {
    fullname,
    email,
    password,
    role,
  };

  // Make POST request to backend for registering user details
  try {
    const response = await fetch(`${API_URL}/api/createuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //Using the function from helper function "addtoken.js" below, we are adding the JWT token to the request 
        ...addToken(), 
      },
      body: JSON.stringify(userdetails),
    });
    const data = await response.json();
    if (response.ok) {
      //Giving a notification if the registration is successfull
       alert("Registration successful!");
       navigate('/Board')
    } else {
      setApiError(data.message || 'User Registration failed. Please try again.');
    }
  } catch {
    setApiError('An error occurred while signing up. Please contact your administrator.');
  }
};

  // User Regiatration form UI
  return (
    <div className="userregistration-container">
      {/* Adding the product image below */}
      <img className="logo" src="/src/assets/Logo/product_ride_compact.png" alt="Product Logo" />
      <h2>User Registration</h2>
      <form className="UserRegistration-form" onSubmit={handleCreateUser}>
        {/* This is where the roles gets assigned in the form */}
        <label htmlFor="category">Select Role:</label>
        <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select Role</option>
          <option value="productmanager">Product Manager</option>
          <option value="softwaredeveloper">Software Developer</option>
          <option value="qatester">QA Tester</option>
        </select>

       {/* Place for adding the full name  */}
            <label htmlFor="fullname">Full Name:</label>
            <input
              type="text"
              name="fullname"
              placeholder="Enter your full name "
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
         

        {/* Email input */}
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password input */}
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Display error message if any */}
        <div className="error-message">{renderErrors()}</div>

        {/* Submit button */}
        <button type="submit">Register User</button>
      </form>
    </div>
  );
};

export default CreateUser;
