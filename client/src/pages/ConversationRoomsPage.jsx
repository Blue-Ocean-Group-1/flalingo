import DefaultPageLayout from '../components/layout/DefaultPageLayout';
import { getChatrooms } from '../services/chatroom.api.js';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import RoomsModal from '../components/RoomsModal.jsx';
import Logger from '../../config/logger.js';
import { useUserData } from '../hooks/useUserData.jsx';
import flagObject from '../assets/Flags/flagObject.js';

export default function ConversationRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const { userData } = useUserData();

  function sortByDifficulty(rooms) {
    const levelOrder = ['Beginner', 'Proficient', 'Advanced'];

    return rooms.sort((a, b) => {
      const [languageA, levelA, numA] = a.name.split(' ');
      const [languageB, levelB, numB] = b.name.split(' ');

      const levelIndexA = levelOrder.indexOf(levelA);
      const levelIndexB = levelOrder.indexOf(levelB);

      if (levelIndexA === levelIndexB) {
        return parseInt(numA) - parseInt(numB);
      }

      return levelIndexA - levelIndexB;
    });
  }

  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const chatrooms = await getChatrooms();
        setRooms(sortByDifficulty(chatrooms));
      } catch (err) {
        Logger.error(err);
      }
    };

    fetchChatrooms();
    let intervalId;
    intervalId = setInterval(() => {
      fetchChatrooms();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function getOtherRoomLanguages(rooms) {
    const set = new Set();

    rooms.forEach((room) => {
      if (userData?.allLanguages.includes(room.language) === false) {
        set.add(room.language);
      }
    });
    return Array.from(set);
  }

  return (
    <DefaultPageLayout>
      <section className="max-4xl sm:mx-auto  text-black">
        <div className="mx-4 mb-4 p-8">
          <h1 className="text-3xl font-semibold">Conversation Rooms</h1>
          <p className="py-2 text-md">
            Join a room to practice your conversation skills with others!
          </p>
          <div className="p-2 mb-2 rounded-md">
            <h2 className="text-lg font-medium">Your Language(s)</h2>
            <div className="p-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-2">
              {userData?.allLanguages.map((language, idx) => (
                <RoomLanguageCard
                  key={`${language}-${idx}`}
                  language={language}
                  roomsData={rooms.filter((room) =>
                    room.language.includes(language),
                  )}
                />
              ))}
            </div>
          </div>
          <div className="p-2 mb-2 rounded-md">
            <h2 className="text-lg font-medium">Other Languages</h2>
            <div className="p-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-2 gap-y-2">
              {rooms &&
                getOtherRoomLanguages(rooms).map((language, idx) => (
                  <RoomLanguageCard
                    key={`${language}-${idx}`}
                    language={language}
                    roomsData={rooms.filter((room) =>
                      room.language.includes(language),
                    )}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>
    </DefaultPageLayout>
  );
}

function RoomLanguageCard({ language, roomsData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex p-3 gap-4 w-full bg-white hover:bg-silver active:shadow-inner rounded-md shadow-md shadow-gray"
      >
        <img
          className="min-h-16 max-w-20 bg-slate-300 rounded-md object-cover"
          src={flagObject[language]}
          alt="flag-img"
        />
        <div className="text-left">
          <h2 className="text-black">{language}</h2>
          <p className="text-black text-xs">
            Number of rooms: {roomsData.length}
          </p>
          <p className="text-black text-xs">
            Active Participants:{' '}
            {roomsData.reduce((acc, room) => acc + room.participantCount, 0)}
          </p>
        </div>
      </button>
      <RoomsModal isOpen={isOpen} setIsOpen={setIsOpen} roomsData={roomsData} />
    </>
  );
}

RoomLanguageCard.propTypes = {
  language: PropTypes.string.isRequired,
  roomsData: PropTypes.array.isRequired,
};
