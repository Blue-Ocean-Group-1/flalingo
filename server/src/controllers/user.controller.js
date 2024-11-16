import progressHelper from '../helpers/addDeckProgress.js';
import { getRandomDailyWords } from '../helpers/randomDailyWords.js';
import { User } from '../models/user.model.js';


const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getDailyWords = async (req, res) => {
  try {
    const dailyWords = await getRandomDailyWords(req.params.id);
    res.status(200).send(dailyWords);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const addDeckProgress = async (req, res) => {
    try {
     await progressHelper(req.body.userId, req.body.language, req.body.deckName, req.body.attempt);
      res.status(200).send('Successfully added timesCompleted');
    }
    catch (error) {
      res.status(500).send({ message: error.message });
    }
}



export { getUsers, getUserById, getDailyWords, addDeckProgress };
