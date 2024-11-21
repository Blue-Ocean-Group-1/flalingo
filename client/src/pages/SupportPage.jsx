import React, { useEffect } from 'react';
import useUserData from '../hooks/useUserData.jsx';
import useAuth from '../hooks/useAuth.jsx';
import logger from '../../config/logger.js';
import { sendFormSubmission } from '../services/email.api.js';

const SupportPage = () => {
  const { authInitialized, token } = useAuth();
  const [userData, loading, error, isAuthenticated] = useUserData();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    logger.debug('SupportPage Debug:', {
      authInitialized,
      token: !!token,
      userData,
      loading,
      error,
      isAuthenticated,
    });
    if (!authInitialized) {
      return;
    }

    if (isAuthenticated && userData && !loading) {
      setFormData((prevState) => ({
        ...prevState,
        name: userData.name || '',
        email: userData.email || '',
      }));
    }
  }, [authInitialized, token, userData, loading, error, isAuthenticated]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      logger.error('User is not authenticated');
      return;
    }
    sendFormSubmission(formData);
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to access the support page.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl text-gray-900 font-bold mb-4">Contact</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
      >
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mb-4 w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mb-4 w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          type="text"
          placeholder="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="mb-4 w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <textarea
          placeholder="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="mb-6 w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          type="submit"
          className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default SupportPage;
