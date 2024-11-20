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
  let displayDecks = currentDecks[0].decks.slice().sort((a, b) => {
    return a?.date - b?.date || 0;
  });
  displayDecks = getDeckPercentage(displayDecks.slice(0, 5));

  return displayDecks.slice(0, 3);
};

export { findBestDisplayDecks, getDeckPercentage };
