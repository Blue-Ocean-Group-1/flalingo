import React, { useEffect, useRef, useState } from 'react';
import { env } from '../../../config/env.js';
import axios from 'axios';
import { createChartDecksData } from '../../utils/createChartData.js';
import { useNavigate } from 'react-router-dom';

const UserReportDisplay = ({ user }) => {
  const navigate = useNavigate();
  const chartRef = useRef(null); // Ref to store the Chart.js instance
  const [userStats, setUserStats] = useState({});
  const [renderStats, setRenderStats] = useState(true);
  const [reportParams, setReportParams] = useState({
    // frequency can be 'monthly', 'weekly', 'daily'
    frequency: 'weekly',
    // type can be 'decks', 'deck', 'words', 'conversation rooms'
    type: 'decks',
    // if type is 'deck', this will be the deck name from the userStats object
    individualDeck: null,
  });

  useEffect(() => {
    axios
      .get(`${env.API_URL}/users/${user._id}/reports`, {
        params: {
          id: user._id,
        },
      })
      .then((response) => {
        console.log(response.data);
        setUserStats(response.data);
        if (
          response.data.weekly ||
          response.data.daily ||
          response.data.monthly
        ) {
          setRenderStats(true);
        } else {
          setRenderStats(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching user stats:', err);
        setRenderStats(false);
      });
  }, [user]);

  useEffect(() => {
    if (Object.keys(userStats).length > 0) {
      if (reportParams.individualDeck !== null) {
        let deckData = {};
        deckData.monthly = userStats?.monthly?.decksCompleted?.filter(
          (deck) => {
            return deck.deckName === reportParams.individualDeck;
          },
        );
        deckData.weekly = userStats?.weekly?.decksCompleted?.filter((deck) => {
          return deck.deckName === reportParams.individualDeck;
        });
        deckData.daily = userStats?.daily?.decksCompleted?.filter((deck) => {
          return deck.deckName === reportParams.individualDeck;
        });
      }
      // Fun fact, for chart.js to work, you have to DESTROY!!!
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      switch (reportParams.frequency) {
        case 'monthly':
          switch (reportParams.type) {
            case 'deck':
              break;
            case 'words':
              break;
            case 'overview':
              break;
            case 'decks':
              if (userStats?.monthly?.decksCompleted?.length) {
                chartRef.current = createChartDecksData(
                  userStats?.monthly,
                  'myStatistics',
                );
              } else {
                setRenderStats(false);
              }
              break;
            default:
              setRenderStats(false);
              break;
          }
          break;
        case 'weekly':
          switch (reportParams.type) {
            case 'deck':
              break;
            case 'words':
              break;
            case 'overview':
              break;
            case 'decks':
              if (userStats?.weekly?.decksCompleted?.length) {
                chartRef.current = createChartDecksData(
                  userStats?.weekly,
                  'myStatistics',
                );
              } else {
                setRenderStats(false);
              }
              break;
            default:
              setRenderStats(false);
              break;
          }
          break;
        case 'daily':
          switch (reportParams.type) {
            case 'deck':
              break;
            case 'words':
              break;
            case 'overview':
              break;
            case 'decks':
              if (userStats?.daily?.decksCompleted?.length) {
                chartRef.current = createChartDecksData(
                  userStats?.daily,
                  'myStatistics',
                );
              } else {
                setRenderStats(false);
              }
              break;
            default:
              break;
          }
          break;
        default:
          setRenderStats(false);
          break;
      }
    }
  }, [userStats, reportParams]);

  return (
    <div className="text-jet w-full mb-16">
      <div>
        <h2 className="text-jet text-center text-4xl m-4">My Statistics</h2>
        <div className="flex justify-center">
          <select
            value={reportParams.frequency}
            onChange={(e) => {
              setRenderStats(true);
              setReportParams((prev) => ({
                ...prev,
                individualDeck: null,
                frequency: e.target.value,
              }));
            }}
            className="p-4 rounded bg-white text-2xl"
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
          </select>
        </div>
        <div className="flex justify-center items-center min-w-3/4 min-h-full">
          {/* Here's the magic graph. It's magic!  */}
          <canvas
            id="myStatistics"
            height={renderStats === false ? '0' : '400'}
            width={renderStats === false ? '0' : '800'}
            className={
              renderStats === false ? 'hidden' : 'min-w-3/4 min-h-full'
            }
          ></canvas>
        </div>
        {renderStats === false && (
          <div className="w-full h-96 flex flex-col justify-center items-center border rounded border-jet">
            <p className="px-80 text-center">No data to show!</p>
            <button
              className="p-2 rounded-xl bg-argentBlue text-jet w-1/3 m-2 mt-6 font-bold hover:scale-105"
              onClick={() => {
                navigate('/flashcards');
              }}
            >
              Start A New Deck
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReportDisplay;
