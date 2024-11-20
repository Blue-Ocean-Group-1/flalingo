import axios from 'axios';

import { env } from '../../config/env';

import logger from '../../config/logger.js';

const getDeckPercentage = (decks) => {
  return decks.map((deck) => {
    let name = deck.deckName.split(' ');
    name.splice(0, 1);
    name.splice(1, 1);

    const newDeck = {
      ...deck,
      deckName: name.join(' '),
      percentage: 0,
    };

    let percentage = Math.floor(
      (deck.timesCompleted.slice(-5).reduce((acc, attempt) => {
        return acc + (attempt?.totalCorrect || 0);
      }, 0) /
        (5 * 10)) *
        100,
    );
    if (percentage > 0) {
      newDeck.percentage = percentage;
    }

    //then.... this calculates how full the circle is
    newDeck.offset = 314.159 - 314.159 * (newDeck.percentage / 100);

    return newDeck;
  });
};

const findBestDisplayDecks = (user) => {
  const currentDecks = (user.progress || []).filter(
    (lang) => lang.language === user.activeLanguages[0],
  );
  if (currentDecks.decks?.length) {
    let displayDecks = getDeckPercentage(currentDecks.decks.slice(0, 5));
    displayDecks = currentDecks[0].sort((a, b) => {
      return a?.percentage - b?.percentage || 0;
    });
    return displayDecks.slice(0, 2);
  }
  return [];
};

const findRecommendedDeck = async (user) => {
  const currentDecks = (user.progress || []).find(
    (lang) => lang.language === user.activeLanguages[0],
  );

  let displayDecks = [];

  if (currentDecks?.decks?.length) {
    try {
      const response = await axios.get(
        `${env.API_URL}/decks/${user.activeLanguages[0]}`,
      );
      const skillLevelDecks = response.data.filter(
        (deck) => deck.skillLevel === currentDecks.skillLevel,
      );

      displayDecks = skillLevelDecks.filter((deck) => {
        return !currentDecks.decks.some(
          (aDeck) => aDeck.deckName === deck.deckName,
        );
      });

      return displayDecks.slice(0, 1); // Explicitly return the result
    } catch (error) {
      logger.error('Error fetching decks:', error);
      return []; // Return an empty array on error
    }
  } else {
    try {
      const response = await axios.get(
        `${env.API_URL}/decks/${user.activeLanguages[0]}`,
      );
      const skillLevelDecks = response.data.filter(
        (deck) => deck.skillLevel === currentDecks?.skillLevel,
      );

      return skillLevelDecks.slice(0, 1); // Explicitly return the result
    } catch (error) {
      logger.error('Error fetching decks:', error);
      return []; // Return an empty array on error
    }
  }
};

export { findBestDisplayDecks, getDeckPercentage, findRecommendedDeck };
