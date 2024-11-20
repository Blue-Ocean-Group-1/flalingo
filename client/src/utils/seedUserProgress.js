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
  const id = '673ce87e7960dbdd5019305d';
  const language = 'Spanish';
  const deckName = 'Beginner Food Vocabulary Deck 1';
  const skillLevel = 'beginner';
  const today = new Date();

  for (let i = 1; i < 10; i++) {
    const attempt = {
      attemptNo: i,
      totalCorrect: 10,
      date: new Date(today.setDate(today.getDate() - 9)),
    };
    setTimeout(() => {
      addTimesCompleted(id, language, deckName, attempt, skillLevel);
      console.log('Added attempt:', attempt);
    }, i * 1000);
  }
};

seedUserProgress();
