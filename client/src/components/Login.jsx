import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.jsx';
import Icon from '../components/common/Icon.jsx';
import Logger from '../../config/logger.js';

export default function Login({ handleSignupClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { loginUser, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const from = sessionStorage.getItem('intendedDestination') || '/dashboard';

    if (isAuthenticated) {
      Logger.info('Login.jsx: User is authenticated, redirecting to:', from);
      sessionStorage.removeItem('intendedDestination');
      navigate(from);
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    if (username === '' || password === '') {
      setError('Please fill in all fields.');
      Logger.error('Login.jsx: Form submission error: Fields are empty.');
      return;
    }
    e.preventDefault();
    setError(null);
    Logger.info('Login.jsx: Attempting to log in user.');
    try {
      await loginUser(username, password);
      Logger.info('Login.jsx: User logged in successfully.');
      navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError('Incorrect username or password.');
          Logger.error(
            'Login.jsx: Login error: Incorrect username or password.',
          );
        } else if (error.response.status === 500) {
          setError('Internal Server Error: Please try again later.');
          Logger.error('Login.jsx: Login error: Internal Server Error.');
        } else {
          setError('An unexpected error occurred. Please try again.');
          Logger.error('Login.jsx: Login error: Unexpected error.');
        }
      } else {
        setError('Network error: Please check your internet connection.');
        Logger.error('Login.jsx: Login error: Network error.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null);
    Logger.debug(`Login.jsx: Input change: ${name} = ${value}`);
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };
  return (
    <div className="absolute bg-gray-50 rounded-md p-10 bg-opacity-60 backdrop-blur-sm">
      <h1 className="text-3xl text-jet text-center font-bold mb-4">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
      >
        {error && <p className="mb-4 text-red-600">{error}</p>}
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
          Login
        </button>
      </form>
      <div className="text-center">
        <p className="text-black">
          Don&apos;t have an account?{' '}
          <button
            onClick={handleSignupClick}
            className="text-gray-700 hover:text-gray-900 font-semibold"
            tabIndex="0"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSignupClick();
              }
            }}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
