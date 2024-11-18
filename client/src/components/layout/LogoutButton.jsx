import React from 'react';
import useAuth from '../../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(() => navigate('/'));
  };

  return <button onClick={handleLogout}>Log Out</button>;
};

export default LogoutButton;
