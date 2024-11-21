import { getDeckPercentage } from './deckProgress.js';

export const splitDecksByLanguageAndTheme = function (
  user,
  percentage,
  condition = 'greaterThanOrEqual',
) {
  let deckTheme = [];
  let comparator;
  if (condition === 'greaterThanOrEqual') {
    comparator = (deck) => deck?.percentage >= percentage;
  }
  if (condition === 'lessThanOrEqual') {
    comparator = (deck) => deck?.percentage <= percentage;
  }
  console.log('user: in bagde logic', user);
  user.progress.forEach((cat) => {
    let decks = getDeckPercentage(cat.decks.slice());
    //console.log('decks percentage:', decks);
    const lang = cat.language;
    let beginner = {};
    let proficient = {};
    let advanced = {};
    console.log('decks:', decks);
    decks.forEach((deck) => {
      if (comparator(deck)) {
        if (deck.skillLevel === 'beginner') {
          let theme = deck.deckName.split(' ')[0];
          console.log('theme:', theme);
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
  console.log('deckTheme after split:', deckTheme);
  return deckTheme;
};

export const getBadges = (user) => {
  console.log('Calculating badges...', user);
  if (!user.allBadges) {
    user.allBadges = [];
  }
  let newBadges = user.allBadges.slice();
  let startingLength = newBadges.length;

  let deckTheme = splitDecksByLanguageAndTheme(user, 80);
  console.log('deckTheme:', deckTheme);
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
  console.log('newBadges:', newBadges);
  return newBadges;
};

export const findPriorityValue = (obj) => {
  // gonna iterate through active language decks to find the nearest 'almost there' badge
  // by looking first through advanced, then proficient, then beginner
  // and looking for deck completion counts of 4, 3, 2, 1 (a deck is considered complete when
  // its percentage is greater than or equal to 80)
  const skillLevels = ['advanced', 'proficient', 'beginner'];
  const valuesToCheck = [4, 3, 2, 1];

  for (const skillLevel of skillLevels) {
    if (obj[skillLevel] !== undefined) {
      const category = obj[skillLevel];
      if (category?.length) {
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
  }

  return null;
};

export const findNearestBadge = (user) => {
  console.log('Finding nearest badge...', user);
  let decks = splitDecksByLanguageAndTheme(user, 80);
  let badge;
  if (decks) {
    const deck = decks.find((deck) => deck.lang === user.activeLanguages[0]);

    badge = findPriorityValue(deck);

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
  }
  return null;
};

//export default { findNearestBadge, getBadges };
