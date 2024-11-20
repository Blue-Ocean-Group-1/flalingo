import { getDeckPercentage } from '../utils/deckProgress';

const splitDecksByLanguageAndTheme = (
  user,
  percentage,
  condition = 'greaterThanOrEqual',
) => {
  let deckTheme = [];
  let comparator;
  if (condition === 'greaterThanOrEqual') {
    comparator = (deck) => deck?.percentage >= percentage;
  }
  if (condition === 'lessThanOrEqual') {
    comparator = (deck) => deck?.percentage <= percentage;
  }
  user.progress.forEach((cat) => {
    let decks = getDeckPercentage(cat.decks.slice());
    const lang = cat.language;
    let beginner = {};
    let proficient = {};
    let advanced = {};
    decks.forEach((deck) => {
      if (comparator(deck)) {
        if (deck.skillLevel === 'beginner') {
          let theme = deck.deckName.split(' ')[0];
          if (beginner[theme]) {
            beginner[theme] += 1;
          } else {
            beginner[theme] = 1;
          }
        }
        if (deck.skillLevel === 'proficient') {
          let theme = deck.deckName.split(' ')[0];
          if (proficient[theme]) {
            proficient[theme] += 1;
          } else {
            proficient[theme] = 1;
          }
        }
        if (deck.skillLevel === 'advanced') {
          let theme = deck.deckName.split(' ')[0];
          if (advanced[theme]) {
            advanced[theme] += 1;
          } else {
            advanced[theme] = 1;
          }
        }
      }
    });
    deckTheme.push({ lang, beginner, proficient, advanced });
  });

  return deckTheme;
};

const getBadges = (user) => {
  let newBadges = user.badges.slice();
  let startingLength = newBadges.length;

  let deckTheme = splitDecksByLanguageAndTheme(user, 80);

  deckTheme.forEach((entry) => {
    let beginnerValues = Object.values(entry.beginner);
    let beginnerKeys = Object.keys(entry.beginner);
    let proficientValues = Object.values(entry.proficient);
    let proficientKeys = Object.keys(entry.proficient);
    let advancedValues = Object.values(entry.advanced);
    let advancedKeys = Object.keys(entry.advanced);

    beginnerValues.forEach((value, index) => {
      if (value === 5) {
        let badge = {
          name: `${beginnerKeys[index]} Beginner`,
          language: entry.lang,
        };
        if (!newBadges.includes(badge)) {
          newBadges.push(badge);
        }
      }
    });

    proficientValues.forEach((value, index) => {
      if (value === 5) {
        let badge = {
          name: `${proficientKeys[index]} Proficient`,
          language: entry.lang,
        };
        if (!newBadges.includes(badge)) {
          newBadges.push(badge);
        }
      }
    });
    advancedValues.forEach((value, index) => {
      if (value === 5) {
        let badge = {
          name: `${advancedKeys[index]} Advanced`,
          language: entry.lang,
        };
        if (!newBadges.includes(badge)) {
          newBadges.push(badge);
        }
      }
    });
  });
  if (newBadges.length > startingLength) {
    // logic for updating user badges
    // or just leave it blank and let it calculate each time? (less efficient)
  }

  return newBadges;
};

const findPriorityValue = (obj) => {
  // gonna iterate through active language decks to find the nearest 'almost there' badge
  // by looking first through advanced, then proficient, then beginner
  // and looking for deck completion counts of 4, 3, 2, 1 (a deck is considered complete when
  // its percentage is greater than or equal to 80)
  const skillLevels = ['advanced', 'proficient', 'beginner'];
  const valuesToCheck = [4, 3, 2, 1];

  for (const skillLevel of skillLevels) {
    const category = obj[skillLevel];
    if (category) {
      for (const value of valuesToCheck) {
        for (const [key, categoryValue] of Object.entries(category)) {
          if (categoryValue === value) {
            let capitalizedSkillLevel =
              skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1);
            return { skillLevel: capitalizedSkillLevel, key, value };
          }
        }
      }
    }
  }

  return null;
};

const findNearestBadge = (user) => {
  let decks = splitDecksByLanguageAndTheme(user, 80);

  const deck = decks.find((deck) => deck.lang === user.activeLanguages[0]);

  let badge = findPriorityValue(deck);

  if (!badge) {
    let firstDecks = user.progress.find(
      (deck) => deck.language === user.activeLanguages[0],
    );
    let firstDeck = firstDecks.decks[0];
    badge = {
      skillLevel: firstDeck?.skillLevel,
      key: firstDeck?.deckName.split(' ')[1],
      value: 0,
    };
  }

  return badge;
};

export { findNearestBadge, getBadges };
