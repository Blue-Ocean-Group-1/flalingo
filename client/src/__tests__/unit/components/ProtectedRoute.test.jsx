// src/components/ProtectedRoute.test.jsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ProtectedRoute from '../../../components/ProtectedRoute.jsx';
import { AuthContext } from '../../../context/authContext.jsx';

describe('ProtectedRoute', () => {
  it('renders children when authenticated', () => {
    const auth = { isAuthenticated: true };
    render(
      <AuthContext.Provider value={{ auth }}>
        <MemoryRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    const auth = { isAuthenticated: false };
    render(
      <AuthContext.Provider value={{ auth }}>
        <MemoryRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
