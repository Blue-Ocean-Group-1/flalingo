import { env } from '../../config/env';

import axios from 'axios';

//let progressSet user.progress.filter((entry) => {entry.language === language})
// let attempNo = progressSet.decks.find((deck) => {deck.deckName === deckName})[0].timesCompleted.length + 1
// Example usage:
// const userId = '6737bd5921b1fac154eadf76';
// const language = 'Spanish';
// const deckName = 'Beginner Family Vocabulary Deck 1';
// const attempt = {
//   attemptNo: 1,
//   totalCorrect: 6,
//   date: new Date(),
// };

async function addTimesCompleted(
  userId,
  language,
  deckName,
  attempt,
  skillLevel,
) {
  axios
    .post(`${env.API_URL}/users/deckProgress`, {
      userId,
      language,
      deckName,
      attempt,
      skillLevel,
    })
    .then(() => {})
    .catch(() => {});
}

export { addTimesCompleted };
