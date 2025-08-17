// Signup.js
import React, { useState } from 'react';
import './signup.css';



// Signup component handles user registration for both individual users and organisations
const Signup = () => {
  // State variables for form fields and error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [organisationName, setOrganisationName] = useState('');
  const [fullname, setFullname] = useState('');
  const [errors, setErrors] = useState([]); // For validation errors,"error" term is used 
  const [apiError, setApiError] = useState(''); // For API/server errors
  let tenantName=''; //variable for storing tenant name 

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

  // Function to handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    // Basic validation
    const validationErrors = [];
    if (!email) validationErrors.push('Please enter the email');
    if (!password) validationErrors.push('Please enter password');
    if (category === 'organisation' && !organisationName) validationErrors.push('Enter your organisation name');
    if (category === 'individualuser' && !fullname) validationErrors.push('Enter ybour name');

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setApiError('');
      return;
    }
    setErrors([]); // clear previous errors
    setApiError(''); // clear previous API error

    //Dynamic assignement of tenantName

   if (category === 'individualuser') {
  tenantName = fullname;
   }

if (category === 'organisation') {
  tenantName = organisationName;
}

    // Prepare signup details
    const signupdetails = {
      category,
      tenantName,
      fullname,
      //organisation: organisationName || null,
      email,
      password,
  
    };

    // Make POST request to backend for registering signup details
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupdetails),
      });
      const data = await response.json();
      if (response.ok) {
        // Handle if registration is successful
        window.location.href = '/';
      } else {
        setApiError(data.message || 'Signup failed. Please try again.');
      }
    } catch {
      setApiError('An error occurred while signing up. Please contact your administrator.');
    }
  };

  // Signup form UI
  //CSS is for this is in signup.css
  return (
    <div className="signup-container">
      <img className="logo" src="/src/assets/Logo/product_ride_compact.png" alt="Product Logo" />
      <h2>Sign up</h2>
      <form className="signup-form" onSubmit={handleSignup}>
        {/* Category selection dropdown */}
        <label htmlFor="category">Select Category:</label>
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="individualuser">Individual User</option>
          <option value="organisation">Organisation</option>
        </select>

        {/* Organisation name input, shown only if 'organisation' is selected */}
        {category === 'organisation' && (
          <>
            <label htmlFor="organisation">Organisation:</label>
            <input
              type="text"
              name="organisation"
              placeholder="Enter organisation name "
              value={organisationName}
              onChange={(e) => setOrganisationName(e.target.value)}
              required
            />
          </>
        )}
       
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
        <button type="submit">Sign up</button>
        {/* Link to login page for existing users */}
        <a href="/" className="already-got-login">Already got Login ?</a>
      </form>
    </div>
  );
};

export default Signup;
