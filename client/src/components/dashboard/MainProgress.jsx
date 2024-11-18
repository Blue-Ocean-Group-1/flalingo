import React, { useEffect, useState } from 'react';

import ProgressBar from './ProgressBar';
import { checkSkillLevelCompletion } from '../../utils/checkSkillLevelCompletion';
import MainLanguageSelect from './MainLanguageSelect';
import BadgeFlag from '../common/BadgeFlag';

import { findNearestBadge } from '../../utils/badgeLogic';

import flagObject from '../../assets/Flags/flagObject.js';
import badgeObject from '../../assets/Badges/badgeObject.js';

const MainProgress = ({ user }) => {
  const [currentSkill, setCurrentSkill] = useState('');
  const [nearestBadge, setNearestBadge] = useState(null);

  useEffect(() => {
    if (user) {
      let skill = user?.progress?.find(
        (prog) => prog.language === user.activeLanguages[0],
      );
      if (skill) {
        setCurrentSkill(skill.skillLevel);
      }
      setNearestBadge(findNearestBadge(user));
      console.log(user);
    }
  }, [user]);

  return (
    <div className="main-progress w-2/3 p-8 bg-argentBlue rounded-xl">
      <div className="main-progress-top justify-between">
        {/* <select className="text-4xl bg-white text-jet p-2 rounded-xl mb-3">
          {user?.allLanguages?.length &&
            user.allLanguages.map((language) => (
              <option
                className="anchor-bottom"
                default={user.activeLanguages[0] === language}
                key={language}
              >
                {language}
              </option>
            ))}
        </select> */}
        <MainLanguageSelect user={user} />
        <div className="text-4xl text-jet p-2 mb-3">
          {currentSkill.charAt(0).toUpperCase() + currentSkill.slice(1)}
        </div>
      </div>
      {user && (
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
  );
};

export default MainProgress;
