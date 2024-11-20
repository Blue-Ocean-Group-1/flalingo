// src/__tests__/unit/hooks/useUserData.test.jsx
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../../services/user.api.js', () => ({
  fetchUserData: vi.fn(),
  updateUserData: vi.fn(),
}));

vi.mock('../../../hooks/useAuth.jsx', () => ({
  default: vi.fn(() => ({ token: 'mock-token' })),
}));

vi.mock('../../../../config/logger.js', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import useUserData from '../../../hooks/useUserData';
import { fetchUserData, updateUserData } from '../../../services/user.api.js';
import Logger from '../../../../config/logger.js';

describe('useUserData Hook', () => {
  const mockUserData = {
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockUpdatedData = {
    name: 'Updated User',
    email: 'updated@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    fetchUserData.mockResolvedValue({ success: true, data: mockUserData });
  });

  describe('updateUser function', () => {
    it('should successfully update user data', async () => {
      updateUserData.mockResolvedValue(mockUpdatedData);

      const { result } = renderHook(() => useUserData());

      await waitFor(() => {
        expect(result.current[1]).toBe(false);
      });

      await act(async () => {
        await result.current[3](mockUpdatedData);
      });

      expect(updateUserData).toHaveBeenCalledWith(
        'mock-token',
        mockUpdatedData,
      );
      expect(result.current[0]).toEqual(mockUpdatedData);
      expect(result.current[2]).toBeNull();
      expect(Logger.info).toHaveBeenCalledWith(
        'useUserData: User data updated',
      );
    });

    it('should handle update errors', async () => {
      const mockError = new Error('Update failed');
      updateUserData.mockRejectedValue(mockError);

      const { result } = renderHook(() => useUserData());

      await waitFor(() => {
        expect(result.current[1]).toBe(false);
      });

      await act(async () => {
        await result.current[3](mockUpdatedData);
      });

      expect(updateUserData).toHaveBeenCalledWith(
        'mock-token',
        mockUpdatedData,
      );
      expect(result.current[2]).toBe('Failed to update');
      expect(Logger.error).toHaveBeenCalledWith(
        'useUserData: Failed to update user data',
        mockError,
      );
    });

    it('should maintain previous data on update failure', async () => {
      updateUserData.mockRejectedValue(new Error('Update failed'));

      const { result } = renderHook(() => useUserData());

      await waitFor(() => {
        expect(result.current[1]).toBe(false);
      });

      const initialData = result.current[0];

      await act(async () => {
        await result.current[3](mockUpdatedData);
      });

      expect(result.current[0]).toEqual(initialData);
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { name: 'Updated Name' };
      const expectedResult = { ...mockUserData, ...partialUpdate };
      updateUserData.mockResolvedValue(expectedResult);

      const { result } = renderHook(() => useUserData());

      await waitFor(() => {
        expect(result.current[1]).toBe(false);
      });

      await act(async () => {
        await result.current[3](partialUpdate);
      });

      expect(updateUserData).toHaveBeenCalledWith('mock-token', partialUpdate);
      expect(result.current[0]).toEqual(expectedResult);
    });

    it('should log debug information for updates', async () => {
      updateUserData.mockResolvedValue(mockUpdatedData);

      const { result } = renderHook(() => useUserData());

      await waitFor(() => {
        expect(result.current[1]).toBe(false);
      });

      await act(async () => {
        await result.current[3](mockUpdatedData);
      });

      expect(Logger.info).toHaveBeenCalledWith(
        'useUserData: Updating user data',
      );
      expect(Logger.debug).toHaveBeenCalledWith(
        'useUserData: updatedUser:',
        mockUpdatedData,
      );
    });
  });
});
