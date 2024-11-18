import { getDeckPercentage } from './deckProgress';

const checkSkillLevelCompletion = (user, language) => {
  let total = 0;
  let checking = user.progress.find((prog) => prog.language === language);
  let decks = getDeckPercentage(checking.decks);
  decks.forEach((deck) => {
    total += deck.percentage;
  });

  // hardcoded 1600 because there are 20 decks, and this is requiring 80% success rate for next level
  return (total / 1600) * 100;
};

export { checkSkillLevelCompletion };