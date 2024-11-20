import React, { useState, useEffect } from 'react';
import { Button } from '@headlessui/react';
import Navbar from '../components/Navbar.jsx';
import api from '../services/index.js';
import Logger from '../../config/logger.js';
import useUserData from '../hooks/useUserData.jsx';

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentDeck, setCurrentDeck] = useState();
  const [currentCard, setCurrentCard] = useState();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentChoices, setCurrentChoices] = useState([]);

  const [currentTheme, setCurrentTheme] = useState('family');
  const [themeDecks, setThemeDecks] = useState([]);

  //user info/progress
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [numCorrect, setNumCorrect] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [correctPopUp, setCorrectPopUp] = useState(false);
  const [incorrectPopUp, setIncorrectPopUp] = useState(false);
  const [isCorrect, setIsCorrect] = useState();
  const [isFinished, setIsFinished] = useState(false);

  const [language, setLanguage] = useState('Spanish');

  const [userData, loading, error, updateUser] = useUserData();

  useEffect(() => {
    if (userData) {
      setLanguage(userData?.activeLanguages[0]);
      setCurrentTheme(userData?.progress[0]?.theme);
      setSkillLevel(userData?.progress[0]?.skillLevel);
    }
  }, [userData]);

  useEffect(() => {
    if (language && skillLevel && currentTheme) {
      fetchDecks();
    }
  }, [language, skillLevel, currentTheme]);

  useEffect(() => {
    if (currentCard) {
      createAnswerChoices();
      setCorrectPopUp(false);
      setIncorrectPopUp(false);
    }
  }, [currentCard]);

  useEffect(() => {
    if (flashcards && currentCardIndex < flashcards.length) {
      setCurrentCard(flashcards[currentCardIndex]);
      setIsFinished(false);
      setIsCorrect(true);
    } else {
      setIsFinished(true);
    }
  }, [currentCardIndex, flashcards]);

  const fetchDecks = async () => {
    try {
      const response = await api.get(
        `/decks/${language}/${skillLevel}/${currentTheme}`,
      );

      if (response.data.length > 0 && response.data[0].flashcards.length > 0) {
        setThemeDecks(response.data);
        Logger.info('Data in useEffect', response.data);
        setCurrentDeck(response.data[0]);
        setFlashcards(filterByDiscard(response.data[0].flashcards));
        setCurrentCard(response.data[0].flashcards[currentCardIndex]);
        createAnswerChoices();
        setIsFinished(false);
        Logger.info('flashcards', flashcards);
        Logger.info('currentCard', currentCard);
        Logger.info('currentChoices', currentChoices);
      } else {
        Logger.warn('No data found');
        setThemeDecks([]);
      }
    } catch (error) {
      Logger.error('Error fetching deck:', error);
    }
  };

  const filterByDiscard = (flashcards) => {
    if (!userData?.discardedFlashcards) return flashcards;
    return flashcards.filter(
      (flashcard) =>
        !userData.discardedFlashcards.some(
          (discarded) => discarded.word === flashcard.word,
        ),
    );
  };

  const createAnswerChoices = () => {
    let answerChoices = [];
    for (let i = 3; i < currentCard.options.length; i++) {
      answerChoices.push(currentCard.options[i].english);
    }
    answerChoices.push(currentCard.translatedWord);
    Logger.info('Answer Choices:', answerChoices);
    setCurrentChoices(shuffle(answerChoices));
  };

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
  };

  if (!currentCard) {
    return <div>Loading...</div>;
  }

  //show answer on click
  const answerBtnClicked = (e) => {
    if (e.target.value === currentCard.translatedWord) {
      console.log('Correct!');
      setCorrectPopUp(true);
      setIsCorrect(true);
      setTimeout(() => setCorrectPopUp(true), 1000);

      if (isCorrect) {
        setNumCorrect(numCorrect + 1);
        setCurrentStreak(currentStreak + 1);
      }

      setCurrentCardIndex(currentCardIndex + 1);
      //update streak
    } else {
      setIsCorrect(false);
      setCurrentStreak(0);
      setIncorrectPopUp(true);
      setTimeout(() => setIncorrectPopUp(false), 1000);
    }
    console.log('Correct:', numCorrect);
  };

  const discardBtnClicked = () => {
    if (!currentDeck?._id || !currentCard?.word) {
      console.error('Missing deck ID or card word');
      return;
    }

    userData.discardedFlashcards.push({
      deckId: currentDeck._id,
      word: currentCard.word,
    });
    updateUser(userData);

    console.log(userData.discardedFlashcards);
    console.log(userData);
  };

  const shuffleBtnClicked = () => {
    //shuffle flashcards
  };

  const displayFinished = () => {
    if (userData) {
      const updateProgressEntry = userData.progress.find(
        (progress) => progress.language === language,
      );

      if (updateProgressEntry) {
        const deck = updateProgressEntry.decks.find(
          (deck) => deck.deckName === currentDeck.name,
        );

        //what if deck doesn't exist?
        if (deck) {
          const attempt = deck.timesCompleted.length + 1;
          const totalCorrect = numCorrect;
          const date = new Date();
          let obj = {
            attemptNo: attempt,
            totalCorrect: totalCorrect,
            date: date,
          };

          deck.timesCompleted.push(obj);
        }
      }
    }

    return (
      <div className="bg-[#C6E600] rounded-lg p-4 mb-6 text-[#3A3A3A] text-center">
        <h1 className="text-2xl font-bold mb-2">Quiz Finished!</h1>
        <h2>
          You got {numCorrect} out of {flashcards.length} correct!
        </h2>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Navbar />
      <div className="flashcardDisplay w-full flex min-h-[calc(100vh-64px)]">
        {/* Main Content */}
        <div className="w-3/4 p-4">
          <div className=" mx-auto">
            {/* Header */}
            <div className="bg-[#6AB9F2] rounded-lg p-4 mb-6 text-black text-center">
              <h1 className="text-2xl font-bold mb-2">{currentDeck.name}</h1>
              <div>
                <h2>
                  Card {currentCardIndex + 1} of {flashcards.length}
                </h2>
              </div>
              {currentStreak > 1 ? (
                <h2>Current Streak {currentStreak + 1} in a row!</h2>
              ) : (
                <h2>Start A Streak!</h2>
              )}
            </div>

            {isFinished ? displayFinished() : null}

            {/* Flashcard Area */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Button
                  className="px-6 py-2 text-[#3A3A3A] transition-colors duration-150 bg-[#6AB9F2] rounded-lg focus:shadow-outline"
                  onClick={discardBtnClicked}
                >
                  Discard
                </Button>
              </div>

              {/* Pop-up Messages */}
              <div className="relative">
                {correctPopUp && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-[#C6E600] text-[#3A3A3A] px-4 py-2 rounded">
                    Correct!
                  </div>
                )}
                {incorrectPopUp && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-[#FF8DE6] text-[#3A3A3A] px-4 py-2 rounded">
                    Incorrect!
                  </div>
                )}
              </div>

              {/* Flashcard */}
              <div
                className={`aspect-[2/1] max-w-2xl mx-auto bg-white rounded-xl shadow-lg flex items-center justify-center p-8 ${
                  incorrectPopUp ? 'animate-heartbeat' : 'animate-wiggle'
                }`}
              >
                <p className="text-4xl font-bold text-gray-800">
                  {currentCard?.word}
                </p>
              </div>

              {/* Answer Choices */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {currentChoices.map((choice, index) => (
                  <Button
                    key={index}
                    className="py-3 px-6 text-lg text-black transition-colors duration-150 bg-[#6AB9F2] rounded-lg focus:shadow-outline hover:bg-[#C6E600] hover:text-[#3A3A3A]"
                    value={choice}
                    onClick={(e) => answerBtnClicked(e)}
                  >
                    {choice}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="otherFlashcards w-1/4 bg-white rounded-lg p-4 shadow">
          <p className="font-semibold mb-2 text-black">Skill Level</p>
          <div className="skillProgressRing">
            <p className="text-black">Circle</p>
          </div>
          <p className="font-semibold mb-4 text-black">Other Flashcards</p>
          <div className="flex flex-col gap-2">
            {themeDecks?.map((deck, index) => (
              <Button
                key={index}
                className="w-full py-2 px-4 text-sm text-[#3A3A3A] transition-colors duration-150 bg-pear rounded-lg focus:shadow-outline hover:bg-[#C6E600]"
                onClick={() => {
                  setCurrentDeck(deck);
                  setFlashcards(deck.flashcards);
                  setCurrentCard(deck.flashcards[0]);
                  createAnswerChoices();
                }}
              >
                {deck.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
