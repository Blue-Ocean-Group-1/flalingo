import React, { useEffect, useRef, useState } from 'react';
import { useUserData } from '../hooks/useUserData.jsx';
import logger from '../../config/logger.js';
import emailjs from '@emailjs/browser';
import { env } from '../../config/env';
import CheckMark from '../components/common/Checkmark.jsx';
const SupportPage = () => {
  const { userData, loading, error } = useUserData();
  const [didSubmitSuccessfully, setDidSubmitSuccessfully] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const form = useRef();

  useEffect(() => {
    if (userData) {
      setName(userData?.name);
      setEmail(userData?.email);
    }
  }, [userData]);

  const sendEmail = (e) => {
    e.preventDefault();
    if (didSubmitSuccessfully) return;
    emailjs
      .sendForm('gmail', 'form_submission', form.current, {
        publicKey: env.EMAIL_JS_PUBLIC_KEY,
      })
      .then(
        () => {
          logger.info('SUCCESS!');
          setDidSubmitSuccessfully(true);
        },
        (error) => {
          logger.error('FAILED...', error.text);
          setErrorMsg('Failed to send message');
        },
      );
  };

  if (loading) {
    return <div>Loading . . . </div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Please log in to access the support page.</div>;
  }

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
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          type="text"
          placeholder="Subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required={true}
          className="mb-4 w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <textarea
          placeholder="Message"
          name="message"
          value={message}
          required={true}
          onChange={(e) => setMessage(e.target.value)}
          className="mb-6 w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          type="submit"
          className={`w-full h-12 flex items-center justify-center bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${didSubmitSuccessfully && 'bg-gray-300 shadow-inner cursor-auto hover:bg-gray-300'}`}
        >
          {didSubmitSuccessfully ? <CheckMark /> : 'Send'}
        </button>
        {errorMsg && (
          <p className="text-red-500 text-xs italic mt-2">{errorMsg}</p>
        )}
      </form>
    </div>
  );
};

export default SupportPage;
