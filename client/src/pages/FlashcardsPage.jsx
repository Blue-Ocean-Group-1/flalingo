import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@headlessui/react';
import Navbar from '../components/Navbar.jsx';
import api from '../services/index.js';
import Logger from '../../config/logger.js';
import { useUserData } from '../hooks/useUserData.jsx';
import { checkSkillLevelCompletion } from '../utils/checkSkillLevelCompletion.js';
import CircleProgressDisplay from '../components/common/CircleProgressDisplay.jsx';
import DefaultPageLayout from '../components/layout/DefaultPageLayout.jsx';
import { addTimesCompleted } from '../utils/addDeckProgress.js';

const themes = ['family', 'food', 'travel', 'household'];

export default function FlashcardsPage() {
  // User-related state
  const { userData, updateUser, activeDeck, setActiveDeck, setUserData } =
    useUserData();
  const [language, setLanguage] = useState(userData?.activeLanguages?.[0]);
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [currentTheme, setCurrentTheme] = useState('family');

  // Deck and card state
  const [themeDecks, setThemeDecks] = useState([]);
  const [currentDeck, setCurrentDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);
  const [currentChoices, setCurrentChoices] = useState([]);

  // Game state
  const [numCorrect, setNumCorrect] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [correctPopUp, setCorrectPopUp] = useState(false);
  const [incorrectPopUp, setIncorrectPopUp] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null); //eslint-disable-line no-unused-vars
  const [isFinished, setIsFinished] = useState(false);

  // for progress ring
  const [ring, setRing] = useState(314.159);
  const [percentage, setPercentage] = useState(0);

  const sortedDecks = (decks) => {
    return decks.sort((a, b) => {
      const getNumber = (deck) => {
        const name = deck.name;
        if (typeof name !== 'string') return 0;
        const match = name.match(/\d+$/);
        return match ? parseInt(match[0], 10) : 0;
      };
      return getNumber(a) - getNumber(b);
    });
  };

  // get the percentage of the progress ring and set states
  useEffect(() => {
    if (userData) {
      let percent = checkSkillLevelCompletion(
        userData,
        userData.activeLanguages[0],
      );
      if (percent > 100) percent = 100;
      setPercentage(percent);
      setRing(314.159 - (percent / 100) * 314.159);
    }
  }, [userData]);

  // Initialize user preferences from userData
  useEffect(() => {
    if (userData?.activeLanguages?.[0]) {
      setLanguage(userData.activeLanguages[0]);
      let metaData = userData.progress.find(
        (prog) => prog.language === userData.activeLanguages[0],
      );
      if (metaData?.decks?.length) {
        setCurrentTheme(metaData.decks[0].theme);
        setSkillLevel(metaData.skillLevel);
      } else if (activeDeck) {
        setCurrentTheme(activeDeck.theme);
        setSkillLevel(activeDeck.skillLevel);
      } else {
        setCurrentTheme('family');
        setSkillLevel(metaData?.skillLevel || 'beginner');
      }
    }
  }, [userData, activeDeck]);

  // Filter flashcards based on discarded status
  const filterByDiscard = useCallback(
    (cards) => {
      if (!userData?.discardedFlashcards?.length) return cards;

      return cards.filter(
        (card) =>
          !userData.discardedFlashcards.some(
            (discarded) => discarded.word === card.word,
          ),
      );
    },
    [userData],
  );

  // Fetch decks when language/skill/theme changes
  useEffect(() => {
    const fetchDecks = async () => {
      if (!(language && skillLevel && currentTheme)) return;

      try {
        const response = await api.get(
          `/decks/${language}/${skillLevel}/${currentTheme}`,
        );

        if (response.data?.length > 0) {
          setThemeDecks(sortedDecks(response.data));
          const firstDeck = activeDeck || response.data[0];
          setCurrentDeck(firstDeck);

          const filteredCards = filterByDiscard(firstDeck.flashcards);
          setFlashcards(filteredCards);
          setCurrentCardIndex(0);
          setIsFinished(false);
        } else {
          Logger.warn('No decks found');
          setThemeDecks([]);
        }
      } catch (error) {
        Logger.error('Error fetching deck:', error);
      }
    };

    fetchDecks();
  }, [language, skillLevel, currentTheme, filterByDiscard, activeDeck]);

  // Update current card when index changes or cards are filtered
  useEffect(() => {
    if (flashcards?.length > 0) {
      if (currentCardIndex < flashcards.length) {
        setCurrentCard(flashcards[currentCardIndex]);
        setIsFinished(false);
      } else {
        setIsFinished(true);
      }
    }
  }, [currentCardIndex, flashcards]);

  // Create answer choices when current card changes
  const createAnswerChoices = useCallback(() => {
    if (!currentCard) return;

    const choices = [
      ...currentCard.options.slice(3).map((opt) => opt.english),
      currentCard.translatedWord,
    ];
    setCurrentChoices(shuffle(choices));
  }, [currentCard]);

  useEffect(() => {
    if (currentCard) {
      createAnswerChoices();
      setCorrectPopUp(false);
      setIncorrectPopUp(false);
    }
  }, [currentCard, createAnswerChoices]);

  const shuffle = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleAnswerClick = (choice) => {
    const correct = choice === currentCard.translatedWord;
    setIsCorrect(correct);

    if (correct) {
      setNumCorrect((prev) => prev + 1);
      setCurrentStreak((prev) => prev + 1);
      setCorrectPopUp(true);
      setCurrentCardIndex((prev) => prev + 1);
      setTimeout(() => setCorrectPopUp(false), 1000);
    } else {
      setCurrentStreak(0);
      setIncorrectPopUp(true);
      setTimeout(() => setIncorrectPopUp(false), 1000);
    }
  };

  const handleDeckChange = (deck) => {
    setActiveDeck(deck);
    setCurrentDeck(deck);
    const filteredCards = filterByDiscard(deck.flashcards);
    setFlashcards(filteredCards);
    setCurrentCardIndex(0);
    setNumCorrect(0);
    setCurrentStreak(0);
  };

  const handleDiscard = () => {
    if (!currentDeck?._id || !currentCard?.word) {
      Logger.error('Missing deck ID or card word');
      return;
    }

    const updatedUserData = {
      ...userData,
      discardedFlashcards: [
        ...userData.discardedFlashcards,
        { deckId: currentDeck._id, word: currentCard.word },
      ],
    };
    updateUser(updatedUserData);

    // Remove card from current deck
    const updatedCards = flashcards.filter(
      (card) => card.word !== currentCard.word,
    );
    setFlashcards(updatedCards);
  };

  const updateProgress = useCallback(() => {
    if (!userData || !currentDeck || !isFinished) return;

    // const progressEntry = userData.progress.find(
    //   (p) => p.language === language,
    // );
    // if (!progressEntry) return;

    // const deck = progressEntry.decks.find(
    //   (d) => d.deckName === currentDeck.name,
    // );
    // if (!deck) return;

    // const attempt = {
    //   attemptNo: deck.timesCompleted.length + 1,
    //   totalCorrect: numCorrect,
    //   date: new Date(),
    // };

    // deck.timesCompleted.push(attempt);
    // updateUser(userData);
    const updateUser = async () => {
      let attemptNo = userData.progress
        .map((entry) => {
          if (entry.language === language) return entry;
          return null;
        })
        .filter((entry) => entry !== null)
        .map((entry) => entry.decks);
      attemptNo = attemptNo[0];
      attemptNo = attemptNo.filter((deck) => {
        if (deck.deckName === currentDeck.name) return true;
        return false;
      });
      attemptNo = attemptNo[0]?.timesCompleted.length + 1;
      if (isNaN(attemptNo)) attemptNo = 1;
      console.log(attemptNo);
      try {
        await addTimesCompleted(
          userData._id,
          language,
          currentDeck.name,
          {
            attemptNo,
            totalCorrect: numCorrect,
            date: new Date(),
          },
          skillLevel,
        ).then(async () => {
          let updatedUser = await api.get(`/users/${userData._id}`);
          console.log(updatedUser);
          setUserData(updatedUser.data);
          setIsFinished(false);
        });
      } catch (error) {
        Logger.error('Error updating progress:', error);
      }
    };

    updateUser();
  }, [userData, currentDeck, language, numCorrect, isFinished, updateUser]);

  useEffect(() => {
    if (isFinished) {
      updateProgress();
    }
  }, [isFinished, updateProgress]);

  if (!currentCard) {
    return <div>Loading...</div>;
  }

  return (
    <DefaultPageLayout>
      <div className="min-h-screen bg-whiteSmoke">
        <div className="flashcardDisplay w-full flex min-h-[calc(100vh-64px)]">
          {/* Main Content */}
          <div className="w-3/4 p-4">
            <div className="mx-auto">
              {/* Header */}
              <div className="bg-[#6AB9F2] rounded-lg p-4 mb-6 text-black text-center">
                <h1 className="text-2xl font-bold mb-2">{currentDeck.name}</h1>
                <h2>
                  Card {currentCardIndex + 1} of {flashcards.length}
                </h2>
                {currentStreak > 1 ? (
                  <h2>Current Streak {currentStreak + 1} in a row!</h2>
                ) : (
                  <h2>Start A Streak!</h2>
                )}
              </div>

              {isFinished && (
                <div className="bg-[#C6E600] rounded-lg p-4 mb-6 text-[#3A3A3A] text-center">
                  <h1 className="text-2xl font-bold mb-2">Quiz Finished!</h1>
                  <h2>
                    You got {numCorrect} out of {flashcards.length} correct!
                  </h2>
                </div>
              )}

              {/* Flashcard Area */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Button
                    className="px-6 py-2 text-[#3A3A3A] transition-colors duration-150 bg-[#6AB9F2] rounded-lg focus:shadow-outline"
                    onClick={handleDiscard}
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
                    {currentCard.word}
                  </p>
                </div>

                {/* Answer Choices */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {currentChoices.map((choice, index) => (
                    <Button
                      key={index}
                      className="py-3 px-6 text-lg text-black transition-colors duration-150 bg-[#6AB9F2] rounded-lg focus:shadow-outline hover:bg-[#C6E600] hover:text-[#3A3A3A]"
                      onClick={() => handleAnswerClick(choice)}
                    >
                      {choice}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="otherFlashcards w-1/4 bg-white rounded-lg p-4 shadow">
            <p className="font-semibold mb-2 text-black">Skill Level</p>
            <div className="skillProgressRing">
              <CircleProgressDisplay ring={ring} percentage={percentage} />
            </div>
            <p className="font-semibold mb-4 text-black">Other Flashcards</p>
            <div className="flex flex-col gap-2">
              {themeDecks?.map((deck, index) => (
                <Button
                  key={index}
                  className="w-full py-2 px-4 text-sm text-[#3A3A3A] transition-colors duration-150 bg-pear rounded-lg focus:shadow-outline hover:bg-[#C6E600]"
                  onClick={() => handleDeckChange(deck)}
                >
                  {deck.name}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2 justify-center mt-2 shadow-md p-0.5 rounded-xl">
              <p className="font-semibold mb-4 text-black mb-0">
                Change Theme:
              </p>
              <select
                className="bg-white rounded-lg p-2 text-jet"
                value={currentTheme}
                onChange={(e) => setCurrentTheme(e.target.value)}
              >
                {themes.map((mappedTheme) => (
                  <option key={mappedTheme} value={mappedTheme}>
                    {mappedTheme}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}
