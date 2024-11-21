import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@headlessui/react';
import Navbar from '../components/Navbar.jsx';
import api from '../services/index.js';
import Logger from '../../config/logger.js';
import { useUserData } from '../hooks/useUserData.jsx';

export default function FlashcardsPage() {
  // User-related state
  const { userData, updateUser } = useUserData();
  const [language, setLanguage] = useState('Spanish');
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

  // Initialize user preferences from userData
  useEffect(() => {
    if (userData?.activeLanguages?.[0]) {
      setLanguage(userData.activeLanguages[0]);
      setCurrentTheme(userData.progress[0]?.theme);
      setSkillLevel(userData.progress[0]?.skillLevel);
    }
  }, [userData]);

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
          setThemeDecks(response.data);
          const firstDeck = response.data[0];
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
  }, [language, skillLevel, currentTheme, filterByDiscard]);

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

    const progressEntry = userData.progress.find(
      (p) => p.language === language,
    );
    if (!progressEntry) return;

    const deck = progressEntry.decks.find(
      (d) => d.deckName === currentDeck.name,
    );
    if (!deck) return;

    const attempt = {
      attemptNo: deck.timesCompleted.length + 1,
      totalCorrect: numCorrect,
      date: new Date(),
    };

    deck.timesCompleted.push(attempt);
    updateUser(userData);
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
    <div className="min-h-screen bg-whiteSmoke">
      <Navbar />
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
            <p className="text-black">Circle</p>
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
        </div>
      </div>
    </div>
  );
}
