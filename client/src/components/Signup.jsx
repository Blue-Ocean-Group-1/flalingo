// src/components/Signup.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerService } from '../services/auth.api.js';
import useAuth from '../hooks/useAuth.jsx';
import Icon from '../components/common/Icon.jsx';
import logger from '../../config/logger.js';

const Signup = ({ handleLoginClick }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name === '' || username === '' || email === '' || password === '') {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    try {
      const data = await registerService(username, email, password, name);
      login(data.token);
      navigate('/dashboard');
    } catch (error) {
      logger.error('Signup.jsx: Registration failed', error);
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null);
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'name':
        setName(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="absolute bg-gray-50 rounded-md p-10 bg-opacity-60 backdrop-blur-sm">
      <h1 className="text-3xl text-jet text-center font-bold mb-4">Sign up</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
      >
        {error && <p className="mb-4 text-red-600">{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={handleChange}
          required
          className="mb-4 w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={handleChange}
          autoComplete="off"
          required
          className="mb-4 w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          autoComplete="off"
          required
          className="mb-4 w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
          autoComplete="off"
          required
          className="mb-6 w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          type="submit"
          className="w-full bg-argentBlue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
          tabIndex="0"
        >
          Sign Up
        </button>
      </form>
      <div className="text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => handleLoginClick()}
            className="text-gray-700 hover:text-gray-900 font-semibold"
            tabIndex="0"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleLoginClick();
              }
            }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
