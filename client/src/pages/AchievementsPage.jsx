import React, { useEffect, useState } from 'react';
import { useUserData } from '../hooks/useUserData.jsx';
import DefaultPageLayout from '../components/layout/DefaultPageLayout.jsx';

export default function AchievementsPage() {
  const { userData, loading } = useUserData();
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    console.log(userData);
    const getBadges = () => {
      let badges = [];
      for (let i = 0; i < userData.allBadges.length; i++) {
        let obj = {
          name: userData.allBadges[i].name,
          language: userData.allBadges[i].language,
        };
        badges.push(obj);
      }
      setBadges(badges);
    };

    if (userData) {
      getBadges();
    }
  }, [userData]);

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
      <div className=" mx-4 mb-4 p-8 xl:pr-[19rem]">
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
          <div className="bg-white rounded-xl shadow-md shadow-jet p-6 mb-8">
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
          <div className="bg-white rounded-xl shadow-md shadow-jet p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Badges
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Placeholder for badge icon */}
                    <div className="w-16 h-16 bg-gray-100 rounded-full mb-3 flex items-center justify-center">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <h3 className="font-medium text-gray-800">{badge.name}</h3>
                    <p className="text-sm text-gray-500">{badge.language}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}
