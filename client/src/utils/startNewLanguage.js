import axios from 'axios';
import { env } from '../../config/env';

const startNewLanguage = (language, userId) => {
  let newUser;
  axios
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
