import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, test } from 'vitest';
import AuthProvider from '../../../context/authContext.jsx';
import AuthContext from '../../../context/authContext.js';

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should set isAuthenticated to true if token is found in localStorage', () => {
    localStorage.setItem('token', 'test-token');
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ auth }) => (
            <div>
              {auth.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </div>
          )}
        </AuthContext.Consumer>
      </AuthProvider>,
    );
    expect(screen.getByText('Authenticated')).toBeInTheDocument();
  });

  test('should set isAuthenticated to false if no token is found in localStorage', () => {
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ auth }) => (
            <div>
              {auth.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </div>
          )}
        </AuthContext.Consumer>
      </AuthProvider>,
    );
    expect(screen.getByText('Not Authenticated')).toBeInTheDocument();
  });

  test('should login and set isAuthenticated to true', () => {
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ auth, login }) => (
            <div>
              <button onClick={() => login('test-token')}>Login</button>
              {auth.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </div>
          )}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    act(() => {
      screen.getByText('Login').click();
    });

    expect(screen.getByText('Authenticated')).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBe('test-token');
  });

  test('should logout and set isAuthenticated to false', () => {
    localStorage.setItem('token', 'test-token');
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ auth, logout }) => (
            <div>
              <button onClick={logout}>Logout</button>
              {auth.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </div>
          )}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    act(() => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByText('Not Authenticated')).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
