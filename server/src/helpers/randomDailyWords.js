import { Deck } from '../models/deck.model.js';
import { User } from '../models/user.model.js';

const generateDailyWords = async (user) => {
  const decks = await Deck.find({ language: user.activeLanguages[0] });
  if (decks.length) {
    const skillLevel = user.progress.find(
      (p) => p.language === user.activeLanguages[0],
    ).skillLevel;
    const filteredDecks = decks.filter(
      (deck) => deck.skillLevel === skillLevel,
    );

    const words = [];
    const usedWords = new Set(); // To track words that are already added

    while (words.length < 5) {
      const randomDeck =
        filteredDecks[Math.floor(Math.random() * filteredDecks.length)];
      const randomFlashcard =
        randomDeck.flashcards[
          Math.floor(Math.random() * randomDeck.flashcards.length)
        ];

      const word = randomFlashcard.word;
      const translatedWord = randomFlashcard.translatedWord;

      // Check if the word is already in the set
      if (!usedWords.has(word)) {
        const insert = {
          word,
          translatedWord,
          deckName: randomDeck.name,
        };

        words.push(insert);
        usedWords.add(word); // Mark the word as used
      }
    }
    return words;
  }
  return null;
};


const getRandomDailyWords = async (userId) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));

  const user = await User.findOne({ _id: userId });
  const dailyWords = user.dailyWords.find((dw) => {
    const date = new Date(dw.date.setHours(0, 0, 0, 0));
    return date.getTime() === startOfDay.getTime();
  });

  if (dailyWords?.words.length) {
    return dailyWords.words;
  } else {
    const newWords = await generateDailyWords(user);

    await User.updateOne(
      { _id: userId },
      {
        $push: {
          dailyWords: {
            date: new Date(),
            words: newWords,
          },
        },
      },
    )
      .then(() => {})
      .catch(() => {});

    return newWords;
  }
};

export { getRandomDailyWords, generateDailyWords };
