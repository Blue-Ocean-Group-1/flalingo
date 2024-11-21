import axios from 'axios';
import { env } from '../../config/env';

const startNewLanguage = async (language, userId) => {
  let newUser;
  await axios
    .patch(`${env.API_URL}/users/${userId}/${language}`, {
      id: userId,
      language,
    })
    .then((res) => {
      newUser = res.data;
    });

  return newUser;
};

export default startNewLanguage;
