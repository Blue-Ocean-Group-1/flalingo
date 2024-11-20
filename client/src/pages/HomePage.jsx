import axios from 'axios';
import useUserData from '../hooks/useUserData.jsx';
import { useEffect, useState } from 'react';
import { env } from '../../config/env';
import { addTimesCompleted } from '../utils/addDeckProgress.js';

import {
  findBestDisplayDecks,
  findRecommendedDeck,
} from '../utils/deckProgress';

import OnboardingModal from '../components/layout/OnboardingModal.jsx';
import ProgressCircle from '../components/dashboard/ProgressCircle.jsx';
import DailyWord from '../components/dashboard/DailyWord';
import MainProgress from '../components/dashboard/MainProgress';
import UserReportDisplay from '../components/dashboard/UserReportDisplay';
import DefaultPageLayout from '../components/layout/DefaultPageLayout';

export default function HomePage() {
  const [dailyWords, setDailyWords] = useState([]);
  const [userData] = useUserData();
  const [user, setUser] = useState('');
  const [displayDecks, setDisplayDecks] = useState([]);
  const [recommendedDeck, setRecommendedDeck] = useState(null);
  const [maxPercentage, setMaxPercentage] = useState(0);
  const [isModalOpen, setModalOpen] = useState(true);

  // You want data? This will give you data
  useEffect(() => {
    setUser(userData);
    if (userData?.progress?.length) {
      setDisplayDecks(findBestDisplayDecks(userData));
    }

    const getRecommendedDeck = async () => {
      const deck = await findRecommendedDeck(userData);
      setRecommendedDeck(deck[0]);
    };
    getRecommendedDeck();

    const getRandomWords = async () => {
      const response = await axios.get(
        `${env.API_URL}/users/${userData._id}/dailyWords`,
        {
          params: {
            id: userData._id,
          },
        },
      );

      // TODO: add logic to show onboarding modal

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

  useEffect(() => {
    console.log(recommendedDeck);
  }, [recommendedDeck]);

  const flipWord = (index) => {
    let newDailyWords = [...dailyWords];
    newDailyWords[index].flipped = !newDailyWords[index].flipped;
    setDailyWords(newDailyWords);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <DefaultPageLayout>
      <section className="flex content-center items-center rounded-xl w-full">
        <div className="flex bg-white mt-12 rounded-2xl w-full">
          <OnboardingModal isOpen={isModalOpen} onClose={handleCloseModal} />
          <div className="p-8 w-1/2 flex flex-col justify-between items-center gap-8">
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
              {!!displayDecks?.length &&
                displayDecks.map((deck) => (
                  <ProgressCircle
                    key={deck._id}
                    deck={deck}
                    language={user.activeLanguages[0]}
                    maxPercentage={maxPercentage}
                    recommended={false}
                  />
                ))}
              {recommendedDeck?.name && (
                <ProgressCircle
                  deck={{
                    ...recommendedDeck,
                    percentage: 0,
                    deckName: recommendedDeck.name,
                  }}
                  language={user.activeLanguages[0]}
                  maxPercentage={0}
                  recommended={true}
                />
              )}
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
          <div className="p-8 w-1/2 flex flex-col justify-around items-center gap-8 pr-20">
            <MainProgress user={user} />
            {user && <UserReportDisplay user={user} />}
          </div>
        </div>
      </section>
    </DefaultPageLayout>
  );
}
