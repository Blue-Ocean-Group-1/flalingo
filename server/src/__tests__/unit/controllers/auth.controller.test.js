// src/__tests__/unit/controllers/auth.controller.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'; // eslint-disable-line

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
  },
}));

vi.mock('../../../models/user.model.js', () => {
  const mockModel = vi.fn().mockImplementation((data) => ({
    _id: 'mock-user-id',
    ...data,
    save: vi.fn().mockImplementation(function () {
      return Promise.resolve(this);
    }),
  }));

  mockModel.findOne = vi.fn();
  mockModel.schema = {
    obj: {
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      name: { type: String, required: true },
      currentLoginStreak: Number,
      longestLoginStreak: Number,
      timeUsingApp: Number,
      gems: { type: Number, default: 0 },
    },
  };

  return {
    User: mockModel,
  };
});

vi.mock('../../../config/env.js', () => ({
  env: {
    JWT_SECRET: 'test-secret',
  },
}));

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../../../config/env.js';
import {
  register,
  login,
  protectedRoute,
} from '../../../controllers/auth.controller.js';
import { User } from '../../../models/user.model.js';

describe('Auth Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 'test-user-id' },
    };
    res = {
      status: vi.fn(() => res),
      json: vi.fn(() => res),
    };
    vi.clearAllMocks();
  });

  describe('register', () => {
    const validUserData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should register a new user successfully', async () => {
      req.body = validUserData;
      const hashedPassword = 'hashedPassword123';
      const mockToken = 'mock-token';

      // Setup mocks
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword);
      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(jwt.sign).mockReturnValue(mockToken);

      await register(req, res);

      expect(User).toHaveBeenCalledWith({
        username: validUserData.username,
        email: validUserData.email,
        password: hashedPassword,
        name: validUserData.name,
        currentLoginStreak: 0,
        longestLoginStreak: 0,
        timeUsingApp: 0,
        gems: 0,
      });

      expect(bcrypt.hash).toHaveBeenCalledWith(validUserData.password, 10);

      expect(User.findOne).toHaveBeenCalledWith({
        $or: [
          { username: validUserData.username },
          { email: validUserData.email },
        ],
      });

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'mock-user-id' },
        env.JWT_SECRET,
        { expiresIn: '1h' },
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ token: mockToken });
    });
    it('should return 400 if required fields are missing', async () => {
      req.body = { username: 'testuser' };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing required fields',
      });
    });

    it('should return 409 if user already exists', async () => {
      req.body = validUserData;
      vi.mocked(User.findOne).mockResolvedValue({ username: 'testuser' });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });

    it('should handle server errors', async () => {
      req.body = validUserData;
      const mockError = new Error('Database error');
      vi.mocked(User.findOne).mockRejectedValue(mockError);

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error',
        error: mockError,
      });
    });
  });

  describe('login', () => {
    const validCredentials = {
      username: 'testuser',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      req.body = validCredentials;
      const mockUser = {
        _id: 'user-id',
        password: 'hashedPassword',
      };
      const mockToken = 'mock-token';

      vi.mocked(User.findOne).mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(true);
      vi.mocked(jwt.sign).mockReturnValue(mockToken);

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        username: { $eq: validCredentials.username },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        validCredentials.password,
        mockUser.password,
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser._id },
        env.JWT_SECRET,
        { expiresIn: '1h' },
      );
      expect(res.json).toHaveBeenCalledWith({ token: mockToken });
    });

    it('should return 401 if user is not found', async () => {
      req.body = validCredentials;
      vi.mocked(User.findOne).mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No such user found' });
    });

    it('should return 401 if password is incorrect', async () => {
      req.body = validCredentials;
      vi.mocked(User.findOne).mockResolvedValue({ password: 'hashedPassword' });
      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Password is incorrect',
      });
    });

    it('should handle server errors', async () => {
      req.body = validCredentials;
      const mockError = new Error('Database error');
      vi.mocked(User.findOne).mockRejectedValue(mockError);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error',
        error: mockError,
      });
    });
  });

  describe('protectedRoute', () => {
    it('should return user data for authenticated request', () => {
      const mockUser = { id: 'test-user-id', name: 'Test User' };
      req.user = mockUser;

      protectedRoute(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'You have accessed a protected route!',
        user: mockUser,
      });
    });
  });
});
