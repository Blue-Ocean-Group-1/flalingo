import DefaultPageLayout from '../components/layout/DefaultPageLayout';
import { getChatrooms } from '../services/chatroom.api.js';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import RoomsModal from '../components/RoomsModal.jsx';

// TODO: Loads in chat log as well as high level chatroom data

export default function ConversationRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const defaultLanguages = ['Spanish'];

  useEffect(() => {
    const fetchChatrooms = async () => {
      const chatrooms = await getChatrooms();
      setRooms(chatrooms);
    };
    fetchChatrooms();
  }, []);

  function getOtherRoomLanguages(rooms) {
    const set = new Set();
    rooms.forEach((room) => {
      if (defaultLanguages.includes(room.language)) return;
      set.add(room.language);
    });
    return Array.from(set);
  }

  return (
    <DefaultPageLayout>
      <section className="max-w-5xl sm:mx-auto pt-6">
        <h1 className="text-3xl font-semibold">Conversation Rooms</h1>
        <p className="py-2 text-md">
          Join a room to practice your conversation skills with others!
        </p>
        <h2 className="text-lg font-medium">Your Language(s)</h2>
        <div className="p-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-2">
          {defaultLanguages.map((language, idx) => (
            <RoomLanguageCard
              key={`${language}-${idx}`}
              language={language}
              roomsData={rooms.filter((room) =>
                room.language.includes(language),
              )}
            />
          ))}
        </div>
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
        className="flex p-3 gap-4 w-full bg-white hover:bg-platinum rounded-md shadow-md"
      >
        <img
          className="min-h-16 max-w-20 bg-slate-300 rounded-md "
          src={`/Flags/${language}.png`}
          alt="flag-img"
        />
        <div className="text-left">
          <h2 className="text-black">{language}</h2>
          <p className="text-black text-xs">
            Number of rooms: {roomsData.length}
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
