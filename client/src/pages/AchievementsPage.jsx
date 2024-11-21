import React, { useEffect, useState } from 'react';
import { useUserData } from '../hooks/useUserData.jsx';
import BadgeFlag from '../components/common/BadgeFlag.jsx';
import { splitDecksByLanguageAndTheme } from '../utils/badgeLogic.js';
import badgeObject from '../../public/Badges/badgeObject.js';
import flagObject from '../../public/Flags/flagObject.js';
import DefaultPageLayout from '../components/layout/DefaultPageLayout.jsx';
import isEqual from 'lodash/isEqual';
export default function AchievementsPage() {
  const { userData, updateUser, loading } = useUserData();

  const [hasSameBadges, setHasSameBadges] = useState(false);

  useEffect(() => {
    const determineBadge = () => {
      let deckData = splitDecksByLanguageAndTheme(userData, 80); //array

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
      if (!hasSameBadges && !isEqual(badges, userData.allBadges)) {
        setHasSameBadges(true);
        updateUser({ allBadges: badges });
      }
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
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
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
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Daily Progress
            </h2>
            <div className="flex space-x-4 justify-between">
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
                          ? 'bg-green-500 text-white shadow-lg scale-105'
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
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Badges
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userData?.allBadges?.map((badge, index) => {
                const formattedBadge = formatBadge(badge);
                if (!formattedBadge) return null;
                return (
                  <BadgeFlag
                    badge={badgeObject[formattedBadge.badgeName]}
                    flag={flagObject[formattedBadge.language]}
                    key={index}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}
