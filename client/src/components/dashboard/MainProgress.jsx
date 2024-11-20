import React, { useEffect, useState } from 'react';

import ProgressBar from './ProgressBar';
import { checkSkillLevelCompletion } from '../../utils/checkSkillLevelCompletion';
import MainLanguageSelect from './MainLanguageSelect';
import BadgeFlag from '../common/BadgeFlag';

import { findNearestBadge } from '../../utils/badgeLogic';

import flagObject from '../../../public/Flags/flagObject.js';
import badgeObject from '../../../public/Badges/badgeObject.js';
import greetings from '../../utils/greetings';

const MainProgress = ({ user, openAddLang }) => {
  const [currentSkill, setCurrentSkill] = useState('');
  const [nearestBadge, setNearestBadge] = useState(null);

  useEffect(() => {
    if (user?.progress?.length) {
      console.log(user);
      let skill = user?.progress?.find(
        (prog) => prog.language === user.activeLanguages[0],
      );
      if (skill) {
        setCurrentSkill(skill.skillLevel);
      }
      let decks = user.progress.find(
        (prog) => prog.language === user.activeLanguages[0],
      );
      let badge;
      if (decks?.decks?.length) {
        badge = findNearestBadge(decks);
      }
      if (badge === undefined) {
        badge = {
          key: 'Family',
          skillLevel: 'Beginner',
        };
      }
      setNearestBadge(badge);
    }
  }, [user]);

  return (
    <div className="w-full p-8 ">
      {user && (
        <div className="flex justify-center pb-8">
          <h3 className="text-4xl text-bold italic text-jet">{`${greetings[user.activeLanguages[0]]}, ${user.name}!`}</h3>
        </div>
      )}
      <div className="main-progress bg-argentBlue rounded-xl p-8">
        <div className="main-progress-top flex flex justify-around p-6 rounded-xl gap-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              My Current Language
            </h3>
            {/* <select
              className="w-full text-2xl bg-white text-jet p-3 rounded-lg shadow-sm border border-gray-300 focus:ring-2 focus:ring-argentBlue focus:outline-none transition duration-300 ease-in-out hover:bg-gray-50"
              value={
                user?.activeLanguages?.length ? user.activeLanguages[0] : ''
              }
            >
              {user?.allLanguages?.length &&
                user.allLanguages.map((language) => (
                  <option className="text-lg p-2" key={language}>
                    {language}
                  </option>
                ))}
            </select> */}
            <MainLanguageSelect user={user} openAddLang={openAddLang} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              My Current Skill Level
            </h3>
            <div className="text-3xl text-jet font-semibold bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-300">
              {currentSkill.charAt(0).toUpperCase() + currentSkill.slice(1)}
            </div>
          </div>
        </div>

        {!!user?.progress?.length && (
          <ProgressBar
            percentage={
              checkSkillLevelCompletion(user, user.activeLanguages[0]) <= 100
                ? checkSkillLevelCompletion(user, user.activeLanguages[0])
                : 100
            }
          />
        )}
        {nearestBadge && (
          <div className="flex justify-around items-center">
            <div className="text-2xl text-jet font-bold p-4 mt-4">
              Closest Badge:
            </div>
            <div className="mt-4 text-jet flex justify-center items-center">
              <p className="font-bold">{`${user.activeLanguages[0]} ${nearestBadge.key} ${nearestBadge.skillLevel}`}</p>
              <BadgeFlag
                badge={
                  badgeObject[`${nearestBadge.key}${nearestBadge.skillLevel}`]
                }
                flag={flagObject[`${user.activeLanguages[0]}`]}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainProgress;
