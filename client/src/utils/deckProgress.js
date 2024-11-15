/* eslint-disable prettier/prettier */
const findBestDisplayDecks = (user) => {
  const currentDecks = (user.progress || []).filter(
    (lang) => lang.language === user.activeLanguages[0],
  );
  const displayDecks = currentDecks[0].decks.sort((a, b) => {
    return (a.timesCompleted?.[-1]?.date - b.timesCompleted?.[-1]?.date) || 0;
  });

  displayDecks.map((deck) => {
    let name = deck.deckName.split(' ');
    name.splice(0, 1);
    name.splice(1, 1);
    deck.deckName = name.join(' ');
    deck.percentage = 0;
    let percentage = Math.floor((deck.timesCompleted.reduce((acc, attempt) => {
      return acc + (attempt?.totalCorrect || 0);
    }, 0) / (deck.timesCompleted.length * 10) * 100));
    if (percentage > 0) {
      deck.percentage = percentage;
    }

    //then.....
    deck.offset = 314.159 - (314.159 * (deck.percentage / 100));

  });


  return displayDecks.slice(0, 3);
};

export { findBestDisplayDecks };
