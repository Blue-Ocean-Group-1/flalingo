import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import flagObject from '../../assets/Flags/flagObject';

const ProgressCircle = ({ deck, language, maxPercentage }) => {
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

  return (
    <button
      key={deck._id}
      className="flex justify-between items-center px-1 py-4 text-xl border-solid border-jet border rounded-xl m-2 shadow-md shadow-jet relative hover:scale-105"
      type="button"
    >
      <h5 className="text-jet font-bold ml-8 text-2xl mt-2">{deck.deckName}</h5>
      <div
        className={`text-jet text-sm font-bold capitalize border border-jet border-solid p-0.5 absolute top-2 left-4 rounded ${deck.skillLevel === 'beginner' ? 'bg-pear' : deck.skillLevel === 'proficient' ? 'bg-webViolet' : 'bg-argBlue'}`}
      >
        {deck.skillLevel}
      </div>
      <img
        className="absolute max-w-8 top-2 p-0.5 left-24 rounded"
        src={flagObject[language]}
        alt={`${language} flag`}
      />
      <div className="relative flex justify-center items-center w-20 h-20">
        <svg
          className="circle-progress"
          width="120"
          height="120"
          viewBox="0 0 120 120"
        >
          <circle
            className="fill-none stroke-[#e6e6e6] stroke-[10] "
            cx="60"
            cy="60"
            r="50"
          ></circle>
          <circle
            className="circle-progress-bar"
            cx="60"
            cy="60"
            r="50"
            strokeDashoffset={ring}
          ></circle>
        </svg>
        <p className="font-bold absolute top-[calc(50% -.75rem)] text-jet">{`${displayPercentage}%`}</p>
      </div>
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
