import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  //variables for storing the entered value 
  //initial state of these variables set to null 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  //This fundtion is to hadleLogin , on pressing login button this funtion gets called 
  //This function sends the login infromation to the backend node server 

 const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }


// Adding enterted email and password to the logindetails variable
    // This is the data that will be sent to the backend for login
  const logindetails= {email: email, password: password};



    //Making post request to the backend for login
    


   try{
    const response = await fetch ('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logindetails),
    });
    const data=await response.json();
    if (response.ok) { 
      // Handle successful login
      console.log('Login successful:', data);
      // Redirect to dashboard or home page
      window.location.href = '/dashboard';
    } else {
      // Handle login error
      setError(data.message || 'Login failed. Please try again.');
    }   

   }
   catch (err) {  
      console.error('Login error:', err);
      setError('An error occurred while logging in. Please contact your administrator.');

   }



 };

  return (
    <div className="login-container">
      <div className="logo">Product Logo</div>
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <div className="auth-actions">
        <button type="button" onClick={() => window.location.href = '/signup'}>Sign up</button>
        <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
      </div>
    </div>
  );
};

export default Login ;
