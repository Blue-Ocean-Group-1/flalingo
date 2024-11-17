import { useEffect, useState } from 'react';

import { env } from '../../config/env';

import axios from 'axios';

import Navbar from '../components/Navbar';

const userID = '6737bd5921b1fac154eadf76';

import { findBestDisplayDecks } from '../utils/deckProgress';

import { addTimesCompleted } from '../utils/addDeckProgress.js';

import ProgressCircle from '../components/dashboard/progressCircle';
import DailyWord from '../components/dashboard/DailyWord';
import MainProgress from '../components/dashboard/MainProgress';
import RecommendedLessons from '../components/dashboard/RecommendedLessons';

export default function HomePage() {
  const [dailyWords, setDailyWords] = useState([]);
  const [dailyMotivation, setDailyMotivation] = useState('');
  const [user, setUser] = useState('');
  const [displayDecks, setDisplayDecks] = useState([]);

  // You want data? This will give you data
  useEffect(() => {
    const getData = async () => {
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
  }, []);

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
          <div className="bg-transparent rounded-lg w-full flex flex-col w-2/4 px-2">
            <div className="flex justify-center align-center">
              <h3 className="text-5xl text-jet">My Decks</h3>
            </div>
            {displayDecks?.length
              ? displayDecks.map((deck) => (
                  <ProgressCircle
                    key={deck._id}
                    deck={deck}
                    language={user.activeLanguages[0]}
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
