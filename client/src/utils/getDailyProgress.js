export default function getDailyProgress(allProgressEntries) {
  return allProgressEntries.find((goal) => {
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const curDate = new Date();
    const differenceInMs = Math.abs(new Date(goal.date) - curDate);
    return differenceInMs <= oneDayInMs;
  });
}
