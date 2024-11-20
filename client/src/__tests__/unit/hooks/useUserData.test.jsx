import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useUserData from '../../../hooks/useUserData';
import { fetchUserData, updateUserData } from '../../../services/user.api';
import useAuth from '../../../hooks/useAuth';

vi.mock('../../../services/user.api', () => ({
  fetchUserData: vi.fn(),
  updateUserData: vi.fn(),
}));

vi.mock('../../../hooks/useAuth', () => ({
  default: vi.fn(),
}));

describe('useUserData', () => {
  const mockToken = 'mockToken';
  const mockUserData = { name: 'John Doe' };
  const mockUpdatedData = { name: 'Jane Doe' };

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({ token: mockToken });
    vi.mocked(fetchUserData).mockResolvedValue(mockUserData);
    vi.mocked(updateUserData).mockResolvedValue(mockUpdatedData);
  });

  it('should initialize with loading true and userData null', async () => {
    const { result } = renderHook(() => useUserData());

    expect(result.current[0]).toBeNull();
    expect(result.current[1]).toBe(true);
    expect(result.current[2]).toBeNull();

    await waitFor(() => {
      expect(result.current[1]).toBe(false);
    });

    expect(result.current[0]).toEqual(mockUserData);
    expect(result.current[2]).toBeNull();
  });

  it('should handle fetch user data error', async () => {
    vi.mocked(fetchUserData).mockRejectedValueOnce(
      new Error('Failed to fetch user data'),
    );

    const { result } = renderHook(() => useUserData());

    await waitFor(() => {
      expect(result.current[1]).toBe(false);
    });

    expect(result.current[0]).toBeNull();
    expect(result.current[2]).toBe('Failed to fetch user data');
  });

  it('should update user data successfully', async () => {
    const { result } = renderHook(() => useUserData());

    await waitFor(() => {
      expect(result.current[1]).toBe(false);
    });

    await act(async () => {
      await result.current[3](mockUpdatedData);
    });

    expect(result.current[0]).toEqual(mockUpdatedData);
    expect(result.current[2]).toBeNull();
  });

  it('should handle update user data error', async () => {
    vi.mocked(updateUserData).mockRejectedValueOnce(
      new Error('Failed to update'),
    );

    const { result } = renderHook(() => useUserData());

    await waitFor(() => {
      expect(result.current[1]).toBe(false);
    });

    await act(async () => {
      await result.current[3](mockUpdatedData);
    });

    expect(result.current[0]).toEqual(mockUserData);
    expect(result.current[2]).toBe('Failed to update');
  });
});
