import React, { useEffect, useState } from 'react';

import startNewLanguage from '../../utils/startNewLanguage';
import { useUserData } from '../../hooks/useUserData';

import flagObject from '../../../public/Flags/flagObject';

const AddNewLanguageModel = ({ closeModal, isOpen }) => {
  const { userData, setUserData } = useUserData();
  const [languages, setLanguages] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (userData) {
      let languageList = ['Spanish', 'French', 'German'];
      languageList.unshift('Please Select A Language');
      setLanguages(languageList);
    }
  }, [userData]);

  const handleLearn = async (e) => {
    e.preventDefault();
    if (selected === null) {
      return;
    } else {
      const newUser = await startNewLanguage(selected, userData._id);
      setUserData(newUser);
      closeModal();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-argentBlue rounded-lg shadow-lg p-8 max-w-md w-full flex flex-col justify-center items-center relative">
        <div className="flex justify-center p-4 text-2xl my-2">
          <h3 className="text-jet">Select A New Language To Learn</h3>
        </div>
        <select
          className="p-1 rounded bg-white text-jet border-jet border my-2"
          onChange={(e) => setSelected(e.target.value)}
        >
          {languages.map((language) => (
            <option
              value={language === 'Please Select A Language' ? null : language}
              key={language}
            >
              {language}
            </option>
          ))}
        </select>
        <div>
          <button
            className="p-2 text-jet rounded-xl border border-jet m-2 font-bold hover:scale-105 bg-white"
            onClick={(e) => handleLearn(e)}
          >
            Start Learning!
          </button>
        </div>
        <button
          onClick={closeModal}
          className="absolute top-2 text-jet border border-jet rounded p-1 left-2 bg-white"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default AddNewLanguageModel;
