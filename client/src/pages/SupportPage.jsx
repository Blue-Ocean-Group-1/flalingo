import React, { useEffect, useRef } from 'react';
// import useUserData from '../hooks/useUserData.jsx';
import logger from '../../config/logger.js';
// import { sendFormSubmission } from '../services/email.api.js';
import emailjs from '@emailjs/browser';
import { env } from '../../config/env';

const SupportPage = () => {
  // const [userData, loading, error, isAuthenticated] = useUserData();

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('gmail', 'form_submission', form.current, {
        publicKey: env.EMAIL_JS_PUBLIC_KEY,
      })
      .then(
        () => {
          logger.info('SUCCESS!');
        },
        (error) => {
          logger.error('FAILED...', error.text);
        },
      );
  };

  // if (loading) {
  //   return <div>Loading . . . </div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  // if (!isAuthenticated) {
  //   return <div>Please log in to access the support page.</div>;
  // }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl text-gray-900 font-bold mb-4">Contact</h1>
      <form
        ref={form}
        onSubmit={sendEmail}
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
      >
        <input
          type="text"
          placeholder="Name"
          name="name"
          className="mb-4 w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          className="mb-4 w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          type="text"
          placeholder="Subject"
          name="subject"
          className="mb-4 w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <textarea
          placeholder="Message"
          name="message"
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
