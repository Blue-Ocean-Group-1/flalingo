import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import CircleProgressDisplay from '../common/CircleProgressDisplay';

import flagObject from '../../../public/Flags/flagObject.js';
import useUserData from '../../hooks/useUserData';

const ProgressCircle = ({ deck, language, maxPercentage, recommended }) => {
  const navigate = useNavigate();
  const [, , , , , setActiveDeck] = useUserData();
  const [ring, setRing] = useState(314.159);
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    if (deck.percentage <= 0 || maxPercentage <= 0) return;

    const numberOfSteps = 100;
    const intervalDuration = 10;
    const exactPercentageIncrement = deck.percentage / numberOfSteps;
    const offsetIncrement = (314.159 * deck.percentage) / (100 * numberOfSteps);

    let currentStep = 0;

    const intervalId = setInterval(() => {
      if (currentStep >= numberOfSteps) {
        clearInterval(intervalId);
        setDisplayPercentage(Math.round(deck.percentage));
      } else {
        setRing((prev) => prev - offsetIncrement);
        setDisplayPercentage((prev) =>
          Math.min(
            Math.round(prev + exactPercentageIncrement),
            Math.round(deck.percentage),
          ),
        );
        currentStep++;
      }
    }, intervalDuration);

    return () => clearInterval(intervalId);
  }, [deck.percentage, maxPercentage]);

  const handleClick = (newDeck) => {
    setActiveDeck(newDeck);
    navigate('/flashcards');
  };

  return (
    <button
      key={deck._id}
      className="flex justify-between items-center px-1 py-4 text-xl border-solid border-jet border rounded-xl m-2 shadow-md shadow-jet relative hover:scale-105"
      type="button"
      onClick={() => handleClick(deck)}
    >
      <h5 className="text-jet font-bold ml-8 text-2xl mt-2">
        {deck.deckName.split(' ').slice(1).join(' ')}
      </h5>
      <div className="flex absolute gap-4 justify-start items-center top-2 left-4 p-0.5 m-0.5">
        <div
          className={`text-jet text-sm font-bold capitalize border border-jet border-solid p-0.5 rounded ${deck.skillLevel === 'beginner' ? 'bg-pear' : deck.skillLevel === 'proficient' ? 'bg-webViolet' : 'bg-argBlue'}`}
        >
          {deck.skillLevel}
        </div>
        <img
          className="max-w-8 p-0.5 rounded"
          src={flagObject[language]}
          alt={`${language} flag`}
        />
        {recommended && (
          <div className="text-jet text-sm font-bold capitalize border border-jet border-solid p-0.5 rounded bg-argentBlue">
            Recommended
          </div>
        )}
      </div>

      <CircleProgressDisplay ring={ring} percentage={displayPercentage} />
    </button>
  );
};
ProgressCircle.propTypes = {
  deck: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    deckName: PropTypes.string.isRequired,
    percentage: PropTypes.number.isRequired,
    offset: PropTypes.number,
  }).isRequired,
};

export default ProgressCircle;
