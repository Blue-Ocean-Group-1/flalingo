import React, { useState } from 'react';
import Login from '../components/Login.jsx';
import Signup from '../components/Signup.jsx';

// TODO: Make mobile compatible

export default function LandingPage() {
  const [signup, setSignup] = useState(false);

  return (
    <div className="bg-white min-h-screen max-xl pr-12">
      <span className="inline-flex gap-2 items-center">
        <img
          className="h-20 w-20 object-cover ml-6 xl:ml-60 mb-4 mt-10"
          src="./PolyGlot_Globe.png"
          alt="placeholder"
        />
        <h1 className="hidden sm:block text-jet text-6xl font-bold mt-8">
          PolyGlot
        </h1>
      </span>
      <div className="flex flex-col justify-center items-center relative size-[95%] xl:size-[72%] mx-auto sm:px-2">
        <img
          className="rounded-full"
          src="./world_landmarks_main.png"
          alt="world landmarks"
        />
        {signup ? (
          <Signup handleLoginClick={() => setSignup(false)} />
        ) : (
          <Login handleSignupClick={() => setSignup(true)} />
        )}
      </div>
    </div>
  );
}
