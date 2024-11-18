import React, { useContext, useEffect, useState } from 'react';
import { env } from '../../../config/env.js';
import axios from 'axios';

const RecommendedLessons = ({ user }) => {
  useEffect(() => {
    axios.get(`${env.API_URL}/decks`).then((response) => {
      let decks = response.data;
    });
  });
  return <div className="text-jet">I am a recommended lesson!</div>;
};

export default RecommendedLessons;
