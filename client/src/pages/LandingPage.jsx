import { LoginButton, SignupButton } from '../imports';
import world_landmarks_main from '../../public/world_landmarks_main.png';
import Navbar from '../components/Navbar.jsx';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.jsx';
import Icon from '../components/common/Icon.jsx';
import Logger from '../../config/logger.js';
import Signup from '../components/Signup.jsx';
import Login from '../components/Login.jsx';

// TODO: Make mobile compatible

export default function LandingPage() {
  const [signup, setSignup] = useState(false);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center items-center relative pt-10">
        <div className="size-[95%] xl:size-[72%] mx-auto sm:px-2 lg:px-8 ">
          <img
            className="rounded-full"
            src={world_landmarks_main}
            alt="world landmarks"
          />
        </div>
        {signup ? (
          <Signup handleLoginClick={() => setSignup(false)} />
        ) : (
          <Login handleSignupClick={() => setSignup(true)} />
        )}
      </div>
    </div>
  );
}
