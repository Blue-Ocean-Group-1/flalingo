import axios from 'axios';
import Navbar from '../components/Navbar';
import useUserData from '../hooks/useUserData.jsx';
import { useEffect, useState } from 'react';
import { env } from '../../config/env';
import { addTimesCompleted } from '../utils/addDeckProgress.js';
import { findBestDisplayDecks } from '../utils/deckProgress';
import logger from '../../config/logger.js';

const userID = '6737bd5921b1fac154eadf76';

import { findBestDisplayDecks } from '../utils/deckProgress';

import { addTimesCompleted } from '../utils/addDeckProgress.js';

import ProgressCircle from '../components/dashboard/progressCircle';
import DailyWord from '../components/dashboard/DailyWord';
import MainProgress from '../components/dashboard/MainProgress';
import RecommendedLessons from '../components/dashboard/RecommendedLessons';

export default function HomePage() {
  const [userData] = useUserData();
  const [dailyWords, setDailyWords] = useState([]);
  const [dailyMotivation, setDailyMotivation] = useState('');
  const [user, setUser] = useState('');
  const [displayDecks, setDisplayDecks] = useState([]);
  const [maxPercentage, setMaxPercentage] = useState(0);

  // You want data? This will give you data
  useEffect(() => {
    const getData = async () => {
      logger.info('HomePage: user data:', userData);
      axios.get(`${env.API_URL}/users/${userID}`).then((res) => {
        setUser(res.data);
        setDisplayDecks(findBestDisplayDecks(res.data));
      });
    };
    getData();

    setDailyMotivation('Do it!');
    const getRandomWords = async () => {
      const response = await axios.get(
        `${env.API_URL}/users/${userID}/dailyWords`,
        {
          params: {
            id: userID,
          },
        },
      );

      response.data.map((word) => {
        word.flipped = false;
      });

      response.data ? setDailyWords(response.data) : null;
    };
    getRandomWords();
  }, [userData]);

  useEffect(() => {
    if (displayDecks) {
      setMaxPercentage(() => {
        return Math.max(...displayDecks.map((deck) => deck.percentage));
      });
    }
  }, [displayDecks]);

  const flipWord = (index) => {
    let newDailyWords = [...dailyWords];
    newDailyWords[index].flipped = !newDailyWords[index].flipped;
    setDailyWords(newDailyWords);
  };

  return (
    <div>
      <Navbar />
      <h1>Home Page</h1>
      <div className="flex bg-white -mt-6">
        <div className="p-8 w-1/2 flex flex-col justify-around items-center gap-8">
          <div className="flex flex-col p-4 rounded-lg gap-4 bg-white w-2/4">
            <div className="flex justify-center align-center">
              <h3 className="text-5xl text-jet">My Daily Words</h3>
            </div>
            {dailyWords?.length &&
              dailyWords.map((word, index) => (
                <DailyWord
                  key={word._id}
                  word={word}
                  index={index}
                  flipWord={flipWord}
                />
              ))}
          </div>
          <div className="bg-transparent rounded-lg flex w-1/2 flex-col max-w-2/4 px-2">
            <div className="flex justify-center align-center">
              <h3 className="text-5xl text-jet">My Decks</h3>
            </div>
            {displayDecks?.length
              ? displayDecks.map((deck) => (
                  <ProgressCircle
                    key={deck._id}
                    deck={deck}
                    language={user.activeLanguages[0]}
                    maxPercentage={maxPercentage}
                  />
                ))
              : null}
            <div className="flex justify-center align-center">
              <button
                onClick={addTimesCompleted}
                className="p-2 rounded-xl bg-argentBlue text-jet w-1/3 m-2 mt-6 font-bold hover:scale-105"
              >
                Start A New Deck
              </button>
            </div>
          </div>
        </div>
        <div className="p-8 w-1/2 flex flex-col justify-around items-center gap-8">
          <MainProgress user={user} />
          <RecommendedLessons />
        </div>
      </div>
    </div>
  );
}
