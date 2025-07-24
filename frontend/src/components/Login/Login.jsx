import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // This is where you would call your backend API
    const isValid = email === 'test@example.com' && password === 'password123';

    if (isValid) {
      // Redirect to home/dashboard
      window.location.href = '/home';
    } else {
      setError('Wrong login details, please enter the correct login details');
    }
  };

  return (
    <div className="login-container">
      <div className="logo">Product Logo</div>
      <h2>Login</h2>
      <form className="login-form">
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
        </form>
      {error && <div className="error-message">{error}</div>}
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => window.location.href = '/register'}>Register</button>
      <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
    </div>
  );
};

export default Login;
