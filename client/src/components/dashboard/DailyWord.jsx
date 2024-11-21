import React, { useState } from 'react';
import PropTypes from 'prop-types';

import '../../pages/mycss.css';

const DailyWord = ({ word, index, flipWord }) => {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = () => {
    setIsFlipping(!isFlipping);
    setTimeout(() => {
      flipWord(index);
    }, 600);
  };

  return (
    <div
      key={word.word}
      className="min-w-[25rem] flex justify-center align-center rounded-xl box-border shadow-md w-full gap-24 p-4 shadow-jet min-w-3/4 bg-white"
    >
      <h5 className="p-1 font-bold text-xl text-jet w-1/3 text-nowrap">
        {word.word}
      </h5>
      <button
        className={`flip-card ${isFlipping ? 'is-flipping' : ''} w-1/3 text-jet font-bold hover:scale-105`}
        onClick={handleFlip}
      >
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <p>Translation</p>
          </div>
          <div className="flip-card-back">
            <p>{word.translatedWord}</p>
          </div>
        </div>
      </button>
    </div>
  );
};

DailyWord.propTypes = {
  word: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    word: PropTypes.string.isRequired,
    translatedWord: PropTypes.string.isRequired,
    flipped: PropTypes.bool.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  flipWord: PropTypes.func.isRequired,
};

export default DailyWord;
