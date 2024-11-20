const generateDailyData = (
  user,
  startDate = new Date().setHours(0, 0, 0, 0), // Start of today
) => {
  const endDate = new Date().setHours(23, 59, 59, 999); // End of today
  const decksCompleted = [];
  const conversationsCompleted = [];
  const wordsCorrect = [];
  const streaks = {
    current: user.currentLoginStreak,
    longest: user.longestLoginStreak,
  };

  // Ensure filters include a return statement
  let timeUsingApp;
  if (user.timeUsingApp.length) {
    timeUsingApp = user.timeUsingApp.filter((item) => {
      return new Date(item.date) >= startDate && new Date(item.date) <= endDate;
    });
  }

  let dailyGoals;
  if (user.dailyGoalProgress.length) {
    dailyGoals = user.dailyGoalProgress.filter((goal) => {
      return new Date(goal.date) >= startDate && new Date(goal.date) <= endDate;
    });
  }

  user.progress.forEach((cat) => {
    cat.decks.forEach((deck) => {
      let deckData = {
        deckName: deck.deckName,
        skillLevel: deck.skillLevel,
        timesCompleted: [],
        average: 0,
      };
      deck.timesCompleted.forEach((attempt) => {
        let testDate = new Date(attempt?.date);
        if (testDate >= startDate && testDate <= endDate) {
          deckData.timesCompleted.push(attempt);
          wordsCorrect.push(attempt.totalCorrect);
          deckData.average += attempt.totalCorrect;
        }
      });
      if (deckData.timesCompleted.length) {
        deckData.average = deckData.average / deckData.timesCompleted.length;
        decksCompleted.push(deckData);
      }
    });
  });

  const dailyData = {
    decksCompleted,
    conversationsCompleted,
    wordsCorrect,
    streaks,
    timeUsingApp,
    dailyGoals,
  };

  return dailyData;
};

const generateWeeklyData = (user) => {
  const today = new Date();
  const lastWeek = new Date(today.setDate(today.getDate() - 7));
  return generateDailyData(user, lastWeek);
};

const generateMonthlyData = (user) => {
  const today = new Date();
  const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
  return generateDailyData(user, lastMonth);
};

const generateUserReport = (user) => {
  const dailyData = generateDailyData(user);
  const weeklyData = generateWeeklyData(user);
  const monthlyData = generateMonthlyData(user);

  let report = {};

  if (dailyData.decksCompleted.length) {
    report.daily = dailyData;
  }

  if (weeklyData.decksCompleted.length) {
    report.weekly = weeklyData;
  }

  if (monthlyData.decksCompleted.length) {
    report.monthly = monthlyData;
  }

  return report;
};

export { generateUserReport };
