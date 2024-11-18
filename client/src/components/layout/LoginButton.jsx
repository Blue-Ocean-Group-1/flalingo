import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/login')}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
    >
      <FontAwesomeIcon icon="fa-solid fa-right-to-bracket" className="mr-2" />
      Log In
    </button>
  );
};

export default LoginButton;
