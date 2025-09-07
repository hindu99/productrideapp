

// Jest tests for the Login
// Verifies rendering, validation, error handling, and token storage on login.

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../pages/Login/Login';

// Clean up mocks and storage after each test
afterEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
  sessionStorage?.clear?.();
});

// Test: Login form renders with all expected fields and button
test('renders login form', () => {
  render(<Login />);
  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});

// Test: Shows error if login is attempted with empty fields
test('shows error if fields are empty', async () => {
  render(<Login />);
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  expect(await screen.findByText(/email and password are required/i)).toBeInTheDocument();
});

// Test: Shows error on failed login (invalid credentials)
test('shows error on failed login', async () => {
  // make fetch return false
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: false,
    json: async () => ({ message: 'Invalid credentials' }),
  });

  render(<Login />);
  fireEvent.change(screen.getByPlaceholderText(/enter email/i), { target: { value: 'test@test.com' } });
  fireEvent.change(screen.getByPlaceholderText(/enter password/i), { target: { value: 'wrongpass' } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
});

// Test: Saves token to localStorage on successful login
test('saves token on successful login', async () => {
  // Spy on fetch and return a successful response once
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: async () => ({ token: 'fake-token' }),
  });

  render(<Login />);
  fireEvent.change(screen.getByPlaceholderText(/enter email/i), { target: { value: 'hindu@kk.com' } });
  fireEvent.change(screen.getByPlaceholderText(/enter password/i), { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  // token is stored 
  await waitFor(() => {
    expect(localStorage.getItem('token')).toBe('fake-token');
  });
});
