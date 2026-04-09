import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthContext } from './context/AuthContext';

test('renders the home page for unauthenticated users', () => {
  render(
    <AuthContext.Provider
      value={{ token: null, setToken: () => {}, user: null, setUser: () => {} }}
    >
      <App />
    </AuthContext.Provider>
  );

  expect(screen.getByText(/welcome to veegil bank/i)).toBeInTheDocument();
});
