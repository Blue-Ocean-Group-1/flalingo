import React, { useEffect, useState } from 'react';
import { useUserData } from '../hooks/useUserData.jsx';
import BadgeFlag from '../components/common/BadgeFlag.jsx';
import {
  splitDecksByLanguageAndThemeTwo,
  getBadges,
} from '../utils/badgeLogic.js';
import badgeObject from '../../public/Badges/badgeObject.js';
import flagObject from '../../public/Flags/flagObject.js';
import DefaultPageLayout from '../components/layout/DefaultPageLayout.jsx';
import isEqual from 'lodash/isEqual';

export default function AchievementsPage() {
  const { userData, updateUser, loading, setUserData } = useUserData();
  const [hasSameBadges, setHasSameBadges] = useState(false);
  const [badges, setBadges] = useState([]);

  console.log(userData);
  useEffect(() => {
    const determineBadge = () => {
      let deckData = splitDecksByLanguageAndThemeTwo(userData, 80); //array
      const badges = [];
      deckData.forEach((deck) => {
        const checkSkillLevel = (skillLevel) => {
          let deckThemes = Object.keys(deck[skillLevel]);
          deckThemes.forEach((theme) => {
            if (deck[skillLevel][theme] === 5) {
              badges.push(`${deck.lang} ${theme} ${skillLevel}`);
            }
          });
        };
        checkSkillLevel('beginner');
        checkSkillLevel('proficient');
        checkSkillLevel('advanced');
      });
      return badges;
    };
    if (userData) {
      const badges = determineBadge();

      const updateBadges = async (newBadges) => {
        if (!hasSameBadges && !isEqual(badges, userData.allBadges)) {
          setHasSameBadges(true);
          await updateUser({ allBadges: newBadges });
          await setUserData({ ...userData, allBadges: newBadges });
          setBadges(newBadges);
        }
      };

      updateBadges(badges);
    }
  }, [userData, updateUser, hasSameBadges]);
  if (loading || !userData || !badgeObject) {
    return <div>Loading...</div>;
  }
  const formatBadge = (badge) => {
    if (!badge) return null;
    let [language, theme, level] = badge.split(' ');
    if (!language || !theme || !level) return null;
    level = level.charAt(0).toUpperCase() + level.slice(1);
    return {
      language: language,
      badgeName: `${theme}${level}`,
    };
  };
  const calculateWeeklyProgress = () => {
    let currentDate = new Date();
    let currentDay = currentDate.getDay();
    let lastSunday = new Date();
    lastSunday.setDate(currentDate.getDate() - currentDay);
    let thisWeek = [];
    for (let i = 0; i < 7; i++) {
      let date = new Date(lastSunday);
      date.setDate(lastSunday.getDate() + i);
      let dailyGoal = userData?.dailyGoalProgress.find(
        (goal) => new Date(goal.date).toDateString() === date.toDateString(),
      );
      thisWeek.push({
        date: date.toDateString(),
        isCompleted: dailyGoal ? dailyGoal.completed : false,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }), // Changed to short
        dayNumber: date.getDate(),
      });
    }
    return thisWeek;
  };
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  return (
    <DefaultPageLayout>
      <div className="mr-8 rounded-md">
        <div className=" mx-4 mb-4 p-8 xl:pr-[19rem]">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Achievements
              </h1>
              <p className="text-gray-600">
                Track your learning progress and earned badges
              </p>
            </div>

            {/* Daily Progress Section */}
            <div className="bg-white rounded-xl shadow-md shadow-jet p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Daily Progress
              </h2>
              <div className="flex space-x-4 justify-between max-w-3xl mx-auto">
                {calculateWeeklyProgress().map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      {day.dayName}
                    </h3>
                    <div
                      className={`
                      rounded-full w-14 h-14 flex items-center justify-center
                      transition-all duration-200 ease-in-out
                      ${
                        day.isCompleted
                          ? 'bg-pistachio text-white shadow-md font-extrabold scale-105'
                          : 'bg-gray-100 text-gray-600'
                      }
                    `}
                    >
                      <p className="text-lg font-semibold">{day.dayNumber}</p>
                    </div>
                    <p
                      className={`text-xs mt-2 ${
                        day.isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {day.isCompleted ? 'Complete' : 'Incomplete'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges Section */}
            <div className="bg-white rounded-xl shadow-md shadow-jet p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Badges
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {badges.map((badge, index) => {
                  const formattedBadge = formatBadge(badge);
                  if (!formattedBadge) return null;
                  return (
                    <div key={index}>
                      <BadgeFlag
                        badge={badgeObject[formattedBadge.badgeName]}
                        flag={flagObject[formattedBadge.language]}
                      />
                      <p className="text-sm text-gray-600">
                        {formattedBadge.badgeName}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}
