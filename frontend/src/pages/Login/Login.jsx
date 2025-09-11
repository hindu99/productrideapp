import React, { useState } from 'react';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL;

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
    const response = await fetch (`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logindetails),
      });
      const data = await response.json();
      if (response.ok) {
        //If the user name and password is correct then the created token from node backend is getting stored locally by this code 
        localStorage.setItem('token', data.token);

        // Hence the login is scuccesfull redirecting the user to the dashboard 
        window.location.href = '/entrypage';
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };


  return (
    <div className="login-container">
      <img className="logo" src="/src/assets/Logo/product_ride_compact.png" alt="Product Logo" />
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

      <button onClick={() => window.location.href = '/signup'}>Register</button>
      <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
    </div>
  );
};

export default Login;
