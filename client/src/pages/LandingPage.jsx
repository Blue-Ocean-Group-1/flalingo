import React, { useState } from 'react';
import world_landmarks_main from '../../public/world_landmarks_main.png';
import Login from '../components/Login.jsx';
import { Link } from 'react-router-dom';
import PolyGlot_Globe from '/public/PolyGlot_Globe.png';
import Signup from '../components/Signup.jsx';

// TODO: Make mobile compatible

export default function LandingPage() {
  const [signup, setSignup] = useState(false);

  return (
    <div>
      <span className="inline-flex gap-2 items-center">
        <img
          className="h-24 w-24 object-cover ml-60 mb-4 mt-10"
          src={PolyGlot_Globe}
          alt="placeholder"
        />
        <h1 className="hidden sm:block text-jet text-4xl font-bold mt-10">
          PolyGlot
        </h1>
      </span>
      <div className="flex flex-col justify-center items-center relative">
        <div className="size-[95%] xl:size-[72%] mx-auto sm:px-2 lg:px-10 ">
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
