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
    if (deck?.timesCompleted?.length) {
      const highestTotalCorrect = Math.max(
        ...deck.timesCompleted.map((attempt) => attempt?.totalCorrect || 0),
      );
      percentage = Math.floor((highestTotalCorrect / 10) * 100);
    }

    if (percentage > 0) {
      newDeck.percentage = percentage;
    }

    //then.... this calculates how full the circle is
    newDeck.offset = 314.159 - 314.159 * (newDeck.percentage / 100);

    return newDeck;
  });
};

const getDeckPercentageTwo = (decks) => {
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
    if (deck?.timesCompleted?.length) {
      const highestTotalCorrect = Math.max(
        ...deck.timesCompleted.map((attempt) => attempt?.totalCorrect || 0),
      );
      percentage = Math.floor((highestTotalCorrect / 10) * 100);
    }

    if (percentage > 0) {
      newDeck.percentage = percentage;
    }

    // This calculates how full the circle is
    newDeck.offset = 314.159 - 314.159 * (newDeck.percentage / 100);

    return newDeck;
  });
};

const findBestDisplayDecks = (user) => {
  const currentDecks = (user.progress || []).filter(
    (lang) => lang.language === user.activeLanguages[0],
  )[0];
  if (currentDecks.decks?.length) {
    let displayDecks = getDeckPercentageTwo(currentDecks.decks.slice(0, 5));
    displayDecks.map((deck, index) => {
      deck.deckName = currentDecks.decks[index].deckName;
    });
    displayDecks.sort((a, b) => {
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
  try {
    const response = await axios.get(
      `${env.API_URL}/decks/${user.activeLanguages[0]}`,
    );
    let skillLevelDecks = response.data;
    if (currentDecks?.skillLevel) {
      skillLevelDecks = skillLevelDecks.filter(
        (deck) => deck.skillLevel === currentDecks.skillLevel,
      );
    }
    let displayDecks = skillLevelDecks;
    if (currentDecks?.decks?.length) {
      let deckNames = currentDecks.decks.map((deck) => deck.deckName);
      displayDecks = skillLevelDecks.filter((deck) => {
        return !deckNames.includes(deck.name);
      });
    }
    if (displayDecks?.length === 0) {
      displayDecks = getDeckPercentageTwo(skillLevelDecks);
      displayDecks = displayDecks.sort((a, b) => {
        return a?.percentage - b?.percentage || 0;
      });
      return displayDecks.slice(0, 1);
    }
    displayDecks = getDeckPercentageTwo(displayDecks);
    return displayDecks.slice(0, 1);
  } catch (error) {
    logger.error('Error fetching decks:', error);
    return [];
  }
};

export {
  findBestDisplayDecks,
  getDeckPercentage,
  findRecommendedDeck,
  getDeckPercentageTwo,
};
