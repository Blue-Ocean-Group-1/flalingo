import User from '../models/user.model.js';

const getDailyProgress = async (user) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  let goals = user.dailyGoalProgress.filter((day) => {
    return new Date(day.date) >= startOfDay && new Date(day.date) <= endOfDay;
  });

  if (!goals.length) {
    let todaysGoals = {
      date: startOfDay,
      completed: false,
      loggedIn: true,
      deckCompleted: false,
      conversationRoomJoined: false,
    };

    await User.findOneAndUpdate(
      { _id: user._id },
      {
        $push: { dailyGoalProgress: todaysGoals },
      },
      { new: true },
    );

    return todaysGoals;
  } else {
    return goals[0];
  }
};

export default getDailyProgress;
