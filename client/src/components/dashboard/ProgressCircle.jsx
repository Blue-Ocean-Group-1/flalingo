import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import CircleProgressDisplay from '../common/CircleProgressDisplay';
import { passFullDeck } from '../../utils/deckProgress';

import flagObject from '../../assets/Flags/flagObject.js';
import { useUserData } from '../../hooks/useUserData';

const ProgressCircle = ({ deck, language, maxPercentage, recommended }) => {
  const navigate = useNavigate();
  const { setActiveDeck } = useUserData();
  const [ring, setRing] = useState(314.159);
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    if (deck.percentage <= 0 || maxPercentage <= 0) return;

    const numberOfSteps = 100;
    const intervalDuration = 1;
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

  const handleClick = async (newDeck) => {
    if (newDeck.flashcards !== undefined) {
      setActiveDeck(newDeck);
    } else {
      // somewhere I screwed the logic of naming conventions and
      // how information is passed. This is a functional band-aid,
      // but realistically logic should be improved elsewhere.
      let fullDeck = await passFullDeck(newDeck.deckName, language);
      setActiveDeck(fullDeck[0]);
    }
    navigate('/flashcards');
  };

  return (
    <button
      key={deck._id}
      className="bg-white flex justify-between items-center px-1 py-4 text-xl min-w-[25rem] rounded-xl m-2 shadow-md shadow-gray relative hover:scale-105"
      type="button"
      onClick={() => handleClick(deck)}
    >
      <h5 className="text-jet font-bold ml-2 text-2xl mt-2 text-nowrap">
        {deck.deckName.split(' ').slice(1).join(' ')}
      </h5>
      <div className="flex absolute gap-4 justify-start items-center top-2 left-2 p-0.25 m-0.25">
        <div
          className={`text-jet text-sm font-bold capitalize border border-jet border-solid p-0.5 rounded ${deck.skillLevel === 'beginner' ? 'bg-pear' : deck.skillLevel === 'proficient' ? 'bg-webViolet' : 'bg-argBlue'}`}
        >
          {deck.skillLevel}
        </div>

        {recommended && (
          <div className="text-jet text-sm font-bold capitalize border border-jet border-solid p-0.5 rounded bg-argentBlue">
            Recommended
          </div>
        )}
        <img
          className="max-w-8 p-0.5 rounded h-[1.5rem]"
          src={flagObject[language]}
          alt={`${language} flag`}
        />
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
