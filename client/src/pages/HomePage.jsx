import axios from 'axios';
import { useUserData } from '../hooks/useUserData.jsx';
import { useEffect, useState } from 'react';
import { env } from '../../config/env';
import startNewLanguage from '../utils/startNewLanguage.js';
import { useNavigate } from 'react-router-dom';

import {
  findBestDisplayDecks,
  findRecommendedDeck,
} from '../utils/deckProgress';

import OnboardingModal from '../components/layout/OnboardingModal.jsx';
import ProgressCircle from '../components/dashboard/ProgressCircle.jsx';
import DailyWord from '../components/dashboard/DailyWord.jsx';
import MainProgress from '../components/dashboard/MainProgress.jsx';
import UserReportDisplay from '../components/dashboard/UserReportDisplay.jsx';
import DefaultPageLayout from '../components/layout/DefaultPageLayout.jsx';
import AddNewLanguageModel from '../components/dashboard/AddNewLanguageModal.jsx';
import { initializeDailyProgress } from '../services/user.api.js';
import getDailyProgress from '../utils/getDailyProgress.js';

export default function HomePage() {
  const navigate = useNavigate();
  const [dailyWords, setDailyWords] = useState([]);

  const { userData, updateUser, setActiveDeck } = useUserData();
  const [displayDecks, setDisplayDecks] = useState([]);
  const [recommendedDeck, setRecommendedDeck] = useState(null);
  const [maxPercentage, setMaxPercentage] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [addNewLanguageModelOpen, setAddNewLanguageModelOpen] = useState(false);

  // useful for tracking information changes!!!! :)
  useEffect(() => {
    console.log(userData);
  }, [userData]);

  useEffect(() => {
    userData?.progress?.length === 0 ? setModalOpen(true) : setModalOpen(false);
  }, [userData, updateUser]);

  useEffect(() => {
    if (userData?.progress?.length === 0 && userData.activeLanguages?.length) {
      const newLanguage = async () => {
        await startNewLanguage(userData.activeLanguages[0], userData._id);
      };
      newLanguage();
    }
  }, [userData]);

  useEffect(() => {
    async function initDailyProgress() {
      try {
        const response = await initializeDailyProgress(userData._id);
        if (response) {
          updateUser({
            ...response.data,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (userData?.dailyGoalProgress) {
      const dailyProgress = getDailyProgress(userData.dailyGoalProgress);
      if (!dailyProgress) {
        initDailyProgress();
      }
    }
  }, [userData, updateUser]);

  // You want data? This will give you data
  useEffect(() => {
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
    if (userData) {
      getRandomWords();
    }
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

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const openAddLanguageModal = () => {
    setAddNewLanguageModelOpen(true);
  };

  const closeAddLanguageModal = () => {
    setAddNewLanguageModelOpen(false);
  };

  // if (loading) return <div>loading</div>;

  return (
    <DefaultPageLayout>
      <section className="flex justify-center items-center rounded-xl w-full xl:pr-[19rem] pb-8">
        <div className="flex rounded-2xl w-full" style={{ minWidth: '70rem' }}>
          <AddNewLanguageModel
            user={userData}
            closeModal={closeAddLanguageModal}
            isOpen={addNewLanguageModelOpen}
          />
          <OnboardingModal isOpen={isModalOpen} onClose={handleCloseModal} />
          <div className="w-3/4 flex flex-col items-center min-w-fit gap-8">
            <div className="flex flex-col p-8 rounded-xl gap-4 w-3/4">
              <div className="flex justify-center align-center min-w-max">
                <h3 className="text-5xl text-jet">My Daily Words</h3>
              </div>
              {dailyWords?.length &&
                userData.progress?.length > 0 &&
                dailyWords.map((word, index) => (
                  <DailyWord
                    key={word._id}
                    word={word}
                    index={index}
                    flipWord={flipWord}
                  />
                ))}
            </div>
            <div className="rounded-xl flex w-3/4 flex-col max-w-3/4 px-8 py-0">
              <div className="flex justify-center align-center">
                <h3 className="text-5xl pb-1 text-jet">My Decks</h3>
              </div>
              {!!displayDecks?.length &&
                displayDecks.map((deck) => (
                  <ProgressCircle
                    key={deck._id}
                    deck={deck}
                    language={userData.activeLanguages[0]}
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
                  language={userData.activeLanguages[0]}
                  maxPercentage={0}
                  recommended={true}
                />
              )}
              <div className="flex justify-center align-center">
                <button
                  onClick={() => {
                    setActiveDeck(recommendedDeck);
                    navigate('/flashcards');
                  }}
                  className="p-2 rounded-xl bg-argentBlue text-jet w-1/3 min-w-fit m-2 mt-6 font-bold hover:scale-105 text-nowrap"
                >
                  Start A New Deck
                </button>
              </div>
            </div>
          </div>
          <div className="w-1/2 flex flex-col items-center gap-16 mt-2">
            {userData && (
              <MainProgress
                user={userData}
                openAddLang={openAddLanguageModal}
              />
            )}
            {userData && <UserReportDisplay user={userData} />}
          </div>
        </div>
      </section>
    </DefaultPageLayout>
  );
}
