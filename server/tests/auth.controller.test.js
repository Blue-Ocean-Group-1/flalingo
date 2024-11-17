import { jest } from '@jest/globals';
import request from 'supertest';

import app from '../src/index.js';

import { generateUserInfo } from './helpers/generateUserData.js';

await jest.unstable_mockModule('../src/models/user.model.js', () => ({
  User: {
    findOne: jest.fn(),
    prototype: {
      save: jest.fn(),
    },
  },
}));

await jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

await jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn(),
    verify: jest.fn(),
  },
}));

const { User: MockedUser } = await import('../src/models/user.model.js');
const mockedBcrypt = await import('bcryptjs');
const mockedJwt = await import('jsonwebtoken');

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user', async () => {
      MockedUser.findOne.mockResolvedValue(null);
      mockedBcrypt.default.hash.mockResolvedValue('hashedPassword');
      MockedUser.prototype.save.mockResolvedValue({});
      mockedJwt.default.sign.mockReturnValue('token');

      const { username, email, password, name } = generateUserInfo();
      const res = await request(app).post('/api/auth/register').send({
        username,
        email,
        password,
        name,
      });

      expect(res.status).toBe(201);
      expect(res.body.token).toHaveLength(171);
    });

    it('should return 409 if user already exists', async () => {
      MockedUser.findOne.mockResolvedValue({});

      await request(app).post('/api/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      });

      const res = await request(app).post('/api/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('User already exists');
    });
  });

  describe('POST /login', () => {
    it('should login a user', async () => {
      MockedUser.findOne.mockResolvedValue({
        username: 'testuser',
        password: 'hashedPassword',
      });
      mockedBcrypt.default.compare.mockResolvedValue(true);
      mockedJwt.default.sign.mockReturnValue('token');

      const res = await request(app).post('/api/auth/login').send({
        username: 'testuser',
        password: 'password',
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toHaveLength(171);
    });

    it('should return 401 if user is not found', async () => {
      MockedUser.findOne.mockResolvedValue(null);

      const res = await request(app).post('/api/auth/login').send({
        username: 'testuser!',
        password: 'password',
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('No such user found');
    });

    it('should return 401 if password is incorrect', async () => {
      MockedUser.findOne.mockResolvedValue({
        username: 'testuser',
        password: 'hashedPassword',
      });
      mockedBcrypt.default.compare.mockResolvedValue(false);

      const res = await request(app).post('/api/auth/login').send({
        username: 'testuser',
        password: 'password!',
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Password is incorrect');
    });
  });

  describe('GET /api/users', () => {
    it('should access protected route', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Users fetched successfully');
    });
  });
});
