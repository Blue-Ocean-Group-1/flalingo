import { env } from '../../config/env';

import axios from 'axios';

// Example usage:
// const userId = '6737bd5921b1fac154eadf76';
// const language = 'Spanish';
// const deckName = 'Beginner Family Vocabulary Deck 1';
// const attempt = {
//   attemptNo: 1,
//   totalCorrect: 6,
//   date: new Date(),
// };

async function addTimesCompleted(userId, language, deckName, attempt) {
  axios
    .post(`${env.API_URL}/users/deckProgress`, {
      userId,
      language,
      deckName,
      attempt,
    })
    .then(() => {})
    .catch(() => {});
}

export { addTimesCompleted };
