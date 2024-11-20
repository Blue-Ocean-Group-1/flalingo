import axios from 'axios';
import Navbar from '../components/Navbar';
import useUserData from '../hooks/useUserData.jsx';
import { useEffect, useState } from 'react';
import { env } from '../../config/env';
import { addTimesCompleted } from '../utils/addDeckProgress.js';
import { findBestDisplayDecks } from '../utils/deckProgress';
import logger from '../../config/logger.js';
import OnboardingModal from '../components/layout/OnboardingModal.jsx';

const userID = '6737bd5921b1fac154eadf76';

export default function HomePage() {
  const [userData] = useUserData();
  const [dailyWords, setDailyWords] = useState([]);
  const [dailyMotivation, setDailyMotivation] = useState('');
  const [user, setUser] = useState('');
  const [displayDecks, setDisplayDecks] = useState([]);
  const [isModalOpen, setModalOpen] = useState(true);

  // You want data? This will give you data
  useEffect(() => {
    axios.get(`${env.API_URL}/users/${userID}`).then((res) => {
      setUser(res.data);
      setDisplayDecks(findBestDisplayDecks(res.data));
    });

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

      // TODO: add logic to show onboarding modal

      response.data.map((word) => {
        word.flipped = false;
      });

      response.data ? setDailyWords(response.data) : null;
    };
    getRandomWords();
  }, [userData]);

  const flipWord = (index) => {
    let newDailyWords = [...dailyWords];
    newDailyWords[index].flipped = !newDailyWords[index].flipped;
    setDailyWords(newDailyWords);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <Navbar />
      <h1>Home Page</h1>
      <OnboardingModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <div className="grid">
        <div className="leftSide">
          <div className="dailyWordsContainer">
            <div className="dailyWordsHeader">
              <h3 className="dailyHeader">My Daily Words</h3>
            </div>
            {dailyWords?.length ? (
              dailyWords.map((word, index) => (
                <div key={word._id} className="wordbox">
                  <h5>{word.word}</h5>
                  <button
                    onClick={() => {
                      flipWord(index);
                    }}
                  >
                    {word.flipped ? word.translatedWord : `Translation`}
                  </button>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
          <div className="deckProgressContainer">
            <div className="dailyWordsHeader">
              <h3 className="dailyHeader">My Decks</h3>
            </div>
            {displayDecks?.length
              ? displayDecks.map((deck) => (
                  <div key={deck._id} className="deckbox">
                    <h5>{deck.deckName}</h5>
                    <div className="progress-container">
                      <svg
                        className="circle-progress"
                        width="120"
                        height="120"
                        viewBox="0 0 120 120"
                      >
                        <circle
                          className="circle-background"
                          cx="60"
                          cy="60"
                          r="50"
                        ></circle>
                        <circle
                          className="circle-progress-bar"
                          cx="60"
                          cy="60"
                          r="50"
                          strokeDashoffset={deck.offset || 0}
                        ></circle>
                      </svg>
                      <p className="progress-text">{`${deck.percentage}%`}</p>
                    </div>
                  </div>
                ))
              : null}
            <div className="startDeckBox">
              <button onClick={addTimesCompleted} className="startDeckBtn">
                Start A New Deck
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
