import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthContext from '../../../context/authContext.js';
import useAuth from '../../../hooks/useAuth.jsx';
import * as authApi from '../../../services/auth.api.js';

vi.mock('../../../services/auth.api.js', () => ({
  loginService: vi.fn(),
}));

vi.mock('../../../../config/logger.js', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('useAuth hook', () => {
  const mockLogin = vi.fn();
  const mockLogout = vi.fn();
  const mockAuthContext = {
    auth: { isAuthenticated: false, token: null },
    login: mockLogin,
    logout: mockLogout,
  };

  const wrapper = ({ children }) => (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.token).toBe(null);
  });

  it('should handle login failure', async () => {
    const mockError = new Error('Login failed');
    vi.mocked(authApi.loginService).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await expect(
        result.current.loginUser('username', 'password'),
      ).rejects.toThrow(mockError);
    });

    expect(result.current.loading).toBe(false);
    expect(authApi.loginService).toHaveBeenCalledWith('username', 'password');
  });

  it('should handle successful login', async () => {
    const mockToken = 'test-token';
    vi.mocked(authApi.loginService).mockResolvedValueOnce({ token: mockToken });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.loginUser('username', 'password');
    });

    expect(authApi.loginService).toHaveBeenCalledWith('username', 'password');
    expect(mockLogin).toHaveBeenCalledWith(mockToken);
  });
});
