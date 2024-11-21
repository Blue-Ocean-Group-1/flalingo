import axios from 'axios';

import { env } from '../../config/env';

import logger from '../../config/logger.js';

const getDeckPercentage = (decks) => {
  return decks.map((deck) => {
    let name;
    if (deck.deckName) {
      name = deck.deckName.split(' ');
      name.splice(0, 1);
      name.splice(1, 1);
    }

    if (deck.name) {
      name = deck.name.split(' ');
      name.splice(0, 1);
      name.splice(1, 1);
    }

    const newDeck = {
      ...deck,
      deckName: name.join(' '),
      percentage: 0,
    };

    let percentage = 0;
    if (decks?.timesCompleted?.length) {
      percentage = Math.floor(
        (deck.timesCompleted.slice(-5).reduce((acc, attempt) => {
          return acc + (attempt?.totalCorrect || 0);
        }, 0) /
          (5 * 10)) *
          100,
      );
    }
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
  const currentDecks = (user?.progress || []).find(
    (lang) => lang.language === user.activeLanguages[0],
  );

  console.log('currenDecks', currentDecks);
  console.log('user', user);

  try {
    // Fetch all decks for the user's active language
    const response = await axios.get(
      `${env.API_URL}/decks/${user.activeLanguages[0]}`,
    );

    // Filter decks by the user's skill level if available
    let skillLevelDecks = response.data;
    if (currentDecks?.skillLevel) {
      skillLevelDecks = skillLevelDecks.filter(
        (deck) => deck.skillLevel === currentDecks.skillLevel,
      );
    }

    // Filter out decks that the user already has in their progress
    let displayDecks = skillLevelDecks;
    if (currentDecks?.decks?.length) {
      let deckNames = currentDecks.decks.map((deck) => deck.deckName);
      displayDecks = skillLevelDecks.filter((deck) => {
        return !deckNames.includes(deck.name);
      });
    }
    if (displayDecks.length === 0) {
      displayDecks = getDeckPercentage(skillLevelDecks);
      displayDecks = displayDecks.sort((a, b) => {
        return a?.percentage - b?.percentage || 0;
      });
      return displayDecks.slice(0, 1);
    }
    // Return the first deck from the filtered list
    displayDecks = getDeckPercentage(displayDecks);
    return displayDecks.slice(0, 1);
  } catch (error) {
    logger.error('Error fetching decks:', error);
    return []; // Return an empty array on error
  }
};

export { findBestDisplayDecks, getDeckPercentage, findRecommendedDeck };
