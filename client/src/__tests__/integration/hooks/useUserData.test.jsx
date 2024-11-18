import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import useUserData from '../../../hooks/useUserData';
import * as userApi from '../../../services/user.api.js';
import * as authHook from '../../../hooks/useAuth.jsx';

vi.mock('../../../services/user.api.js', () => ({
  fetchUserData: vi.fn(),
  updateUserData: vi.fn(),
}));

vi.mock('../../../hooks/useAuth.jsx', () => ({
  default: vi.fn(),
}));

describe('useUserData Integration', () => {
  const mockToken = 'mock-token';
  const mockUserData = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authHook.default).mockReturnValue({ token: mockToken });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Data Fetching', () => {
    it('should fetch user data when token is available', async () => {
      vi.mocked(userApi.fetchUserData).mockResolvedValueOnce(mockUserData);

      const { result } = renderHook(() => useUserData());

      expect(result.current[0]).toBeNull();
      expect(result.current[1]).toBe(true);
      expect(result.current[2]).toBeNull();

      await waitFor(() => {
        expect(result.current[1]).toBe(false);
      });

      expect(result.current[0]).toEqual(mockUserData);
      expect(result.current[1]).toBe(false);
      expect(result.current[2]).toBeNull();

      expect(userApi.fetchUserData).toHaveBeenCalledWith(mockToken);
    });

    it('should handle fetch error gracefully', async () => {
      const mockError = new Error('API Error');
      vi.mocked(userApi.fetchUserData).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useUserData());

      await waitFor(() => {
        expect(result.current[1]).toBe(false);
      });

      expect(result.current[0]).toBeNull();
      expect(result.current[1]).toBe(false);
      expect(result.current[2]).toBe('Failed to fetch user data');
    });

    it('should not fetch data when token is not available', async () => {
      vi.mocked(authHook.default).mockReturnValue({ token: null });

      const { result } = renderHook(() => useUserData());

      await waitFor(() => {
        expect(result.current[1]).toBe(false);
      });

      expect(result.current[0]).toBeNull();
      expect(result.current[1]).toBe(false);
      expect(result.current[2]).toBeNull();

      expect(userApi.fetchUserData).not.toHaveBeenCalled();
    });
  });

  describe('User Data Updates', () => {
    it('should update user data successfully', async () => {
      const updatedUserData = { ...mockUserData, name: 'Jane Doe' };
      vi.mocked(userApi.fetchUserData).mockResolvedValueOnce(mockUserData);
      vi.mocked(userApi.updateUserData).mockResolvedValueOnce(updatedUserData);

      const { result } = renderHook(() => useUserData());

      await waitFor(() => {
        expect(result.current[1]).toBe(false);
      });

      await act(async () => {
        await result.current[3](updatedUserData);
      });

      expect(result.current[0]).toEqual(updatedUserData);
      expect(result.current[2]).toBeNull();

      expect(userApi.updateUserData).toHaveBeenCalledWith(
        mockToken,
        updatedUserData,
      );
    });

    it('should handle update errors gracefully', async () => {
      const mockError = new Error('Update failed');
      vi.mocked(userApi.fetchUserData).mockResolvedValueOnce(mockUserData);
      vi.mocked(userApi.updateUserData).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useUserData());

      await waitFor(() => {
        expect(result.current[1]).toBe(false);
      });

      const updateData = { name: 'Jane Doe' };
      await act(async () => {
        await result.current[3](updateData);
      });

      expect(result.current[0]).toEqual(mockUserData);
      expect(result.current[2]).toBe('Failed to update');
    });
  });

  describe('Token Changes', () => {
    it('should refetch data when token changes', async () => {
      const newToken = 'new-token';
      const newUserData = { ...mockUserData, name: 'New User' };

      vi.mocked(userApi.fetchUserData)
        .mockResolvedValueOnce(mockUserData)
        .mockResolvedValueOnce(newUserData);

      const { result, rerender } = renderHook(() => useUserData());

      await waitFor(() => {
        expect(result.current[1]).toBe(false);
      });

      vi.mocked(authHook.default).mockReturnValue({ token: newToken });
      rerender();

      await waitFor(() => {
        expect(result.current[0]).toEqual(newUserData);
      });

      expect(userApi.fetchUserData).toHaveBeenCalledTimes(2);
      expect(userApi.fetchUserData).toHaveBeenCalledWith(newToken);
    });
  });
});
