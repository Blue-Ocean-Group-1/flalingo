import { getMotivationalQuote } from '../../utils/motivationalQuotes.js';
import { useUserData } from '../../hooks/useUserData';
import { useEffect, useState } from 'react';
import CheckMark from './Checkmark.jsx';
import Brand from './Brand.jsx';

import getDailyProgress from '../../utils/getDailyProgress.js';

export default function ProgressSidebar() {
  const { userData } = useUserData();
  const [randomQuote, setRandomQuote] = useState('');

  useEffect(() => {
    setRandomQuote(
      userData?.allLanguages[0]
        ? getMotivationalQuote(userData?.allLanguages[0])
        : 'Spanish',
    );
  }, [userData?.allLanguages]);

  const dailyProgress = userData?.dailyGoalProgress
    ? getDailyProgress(userData?.dailyGoalProgress)
    : {};

  console.log(randomQuote);

  return (
    <div className="flex-col space-y-2 my-6 mx-auto text-jet">
      <Brand />
      <div className="p-4 text-black bg-white rounded-md shadow-md shadow-jet">
        <div className="flex flex-col space-y-3 py-2">
          <h2 className="text-lg font-medium">Daily Goals</h2>

          <div className="inline-flex gap-1 items-center">
            <CheckMark />
            <p className="text-sm">Login Daily</p>
          </div>
          <div className="inline-flex gap-1 items-center">
            {dailyProgress?.conversationRoomJoined ? (
              <CheckMark />
            ) : (
              <XCircle />
            )}
            <p className="text-sm">Join a Conversation Room</p>
          </div>
          <div className="inline-flex gap-1 items-center">
            {dailyProgress?.deckCompleted ? <CheckMark /> : <XCircle />}
            <p className="text-sm">Complete a flashcard deck</p>
          </div>
        </div>
      </div>
      <div className="p-4 text-black bg-white rounded-md shadow-md shadow-jet">
        <h2 className="text-lg font-medium pb-2">Random Quote</h2>
        <div className="flex flex-col space-y-2">
          <p className="text-sm italic">
            {randomQuote.quote}
            <br />
          </p>
          <p className="text-sm italic">{randomQuote.translation}</p>
          <p className="text-xs pb-2"></p>
        </div>
      </div>
    </div>
  );
}

const XCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-8 text-wisteria"
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
      clipRule="evenodd"
    />
  </svg>
);
