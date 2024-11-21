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

async function addTimesCompleted(
  userId,
  language,
  deckName,
  attempt,
  skillLevel,
) {
  axios
    .post(`http://localhost:3000/api/users/deckProgress`, {
      userId,
      language,
      deckName,
      attempt,
      skillLevel,
    })
    .then((res) => {
      console.log('Successfully added timesCompleted');
    })
    .catch((err) => {
      console.error(err);
    });
}
const seedUserProgress = async () => {
  const id = '673c0d334831b6796751d2fe';
  const language = 'Spanish';
  const deckName = 'Beginner Food Vocabulary Deck 2';
  const skillLevel = 'beginner';
  const today = new Date();

  for (let i = 1; i < 2; i++) {
    const attempt = {
      attemptNo: i,
      totalCorrect: Math.floor(Math.random() * 10),
      date: new Date(today.setDate(today.getDate() - 9)),
    };
    setTimeout(() => {
      addTimesCompleted(id, language, deckName, attempt, skillLevel);
      console.log('Added attempt:', attempt);
    }, i * 1000);
  }
};

seedUserProgress();
