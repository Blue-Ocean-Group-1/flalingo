import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthContext from '../../../context/authContext.js';
import useAuth from '../../../hooks/useAuth.jsx';
import * as authApi from '../../../services/auth.api.js';

vi.mock('../../../services/auth.api.js', () => ({
  loginService: vi.fn(),
}));

describe('useAuth Integration', () => {
  const mockToken = 'mock-token';
  const mockUsername = 'testuser';
  const mockPassword = 'testpass';

  const setupAuthContext = (initialState = {}) => {
    const defaultState = {
      auth: { isAuthenticated: false, token: null },
      login: vi.fn(),
      logout: vi.fn(),
      ...initialState,
    };

    return {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={defaultState}>
          {children}
        </AuthContext.Provider>
      ),
      ...defaultState,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication Flow', () => {
    it('should handle successful login flow', async () => {
      const { wrapper, login } = setupAuthContext();
      vi.mocked(authApi.loginService).mockResolvedValueOnce({
        token: mockToken,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.loading).toBe(false);
      expect(result.current.token).toBeNull();

      await act(async () => {
        await result.current.loginUser(mockUsername, mockPassword);
      });

      expect(login).toHaveBeenCalledWith(mockToken);
      expect(result.current.loading).toBe(false);
      expect(authApi.loginService).toHaveBeenCalledWith(
        mockUsername,
        mockPassword,
      );
    });

    it('should handle login failure correctly', async () => {
      const { wrapper } = setupAuthContext();
      const mockError = new Error('Invalid credentials');
      vi.mocked(authApi.loginService).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(async () => {
        await act(async () => {
          await result.current.loginUser(mockUsername, mockPassword);
        });
      }).rejects.toThrow(mockError);

      expect(result.current.loading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.token).toBeNull();
    });

    it('should handle logout correctly', async () => {
      const mockLogout = vi.fn();
      const { wrapper } = setupAuthContext({
        auth: { isAuthenticated: true, token: mockToken },
        logout: mockLogout,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.token).toBe(mockToken);

      act(() => {
        result.current.logout();
      });

      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe('Loading State Management', () => {
    it('should manage loading state during login process', async () => {
      const { wrapper } = setupAuthContext();
      let resolveLogin;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });

      vi.mocked(authApi.loginService).mockImplementationOnce(
        () => loginPromise,
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      const loginProcess = result.current.loginUser(mockUsername, mockPassword);

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      await act(async () => {
        resolveLogin({ token: mockToken });
        await loginProcess;
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should reset loading state on error', async () => {
      const { wrapper } = setupAuthContext();
      const mockError = new Error('Network error');
      vi.mocked(authApi.loginService).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(async () => {
        await act(async () => {
          try {
            await result.current.loginUser(mockUsername, mockPassword);
          } catch (error) {
            await waitFor(() => {
              expect(result.current.loading).toBe(false);
            });
            throw error;
          }
        });
      }).rejects.toThrow(mockError);

      expect(result.current.loading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.token).toBeNull();
    });
  });

  describe('Context Integration', () => {
    it('should properly integrate with AuthContext', () => {
      const testCases = [
        { auth: { isAuthenticated: true, token: mockToken } },
        { auth: { isAuthenticated: false, token: null } },
        { auth: { isAuthenticated: true, token: 'different-token' } },
      ];

      testCases.forEach((contextState) => {
        const { wrapper } = setupAuthContext(contextState);
        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.isAuthenticated).toBe(
          contextState.auth.isAuthenticated,
        );
        expect(result.current.token).toBe(contextState.auth.token);
      });
    });

    it('should expose context methods correctly', () => {
      const customLogin = vi.fn();
      const customLogout = vi.fn();
      const { wrapper } = setupAuthContext({
        login: customLogin,
        logout: customLogout,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.login).toBe(customLogin);
      expect(result.current.logout).toBe(customLogout);
    });
  });
});
