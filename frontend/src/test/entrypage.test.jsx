// Jest tests for the Entrypage
// 

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EntryPage from '../pages/Entrypage/entrypage';

// Clean up mocks and storage after each test
afterEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
  sessionStorage?.clear?.();
});

// Test: Entrypage form renders with all expected fields and button
test('renders entrypage form', () => {
  render(<EntryPage />);
  expect(screen.getByRole('heading', { name: /Select a Project/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Project/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
});

// Test: Shows error if login is attempted with empty fields
test('Continue button is disabled if no project is selected', () => {
  render(<EntryPage />);
  const continueButton = screen.getByRole('button', { name: /continue/i });
  // Button should be disabled initially
  expect(continueButton).toBeDisabled();
  // Checking whether the screen is giving instruction to select a project first 
  expect(continueButton).toHaveAttribute(
    'title',
    'Please select a project first'
  );
});


// Mock ProjectSelect in order to check whether the button is visible after selection 
jest.mock('../components/SelectionDropdowns/projectselector.jsx', () => {
  return function MockProjectSelect({ value, onChange }) {
    return (
      <select
        aria-label="Project"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Select --</option>
        <option value="p1">Project 1</option>
      </select>
    );
  };
});

test('continue button is not clickable till the project is selected ', () => {
  render(<EntryPage />);

  const continueButton = screen.getByRole('button', { name: /Continue/i });
  expect(continueButton).toBeDisabled();

  fireEvent.change(screen.getByLabelText(/Project/i), {
    target: { value: 'p1' },
  });

  expect(continueButton).toBeEnabled();
});