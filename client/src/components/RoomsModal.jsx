import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from '@headlessui/react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from './common/Icon.jsx';

export default function RoomsModal({ isOpen, setIsOpen, roomsData }) {
  function handleJoin() {
    setIsOpen(false);
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0"
      />
      <div className="text-black fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative sm:w-2/3 h-5/6 sm:h-3/4 sm:max-h-3/4 space-y-2 bg-white pt-8 pb-2 px-10 duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <button
            className="absolute h-4 w-4 right-4 top-2"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon="fa-solid fa-x" />
          </button>
          <DialogTitle className="font-bold text-2xl">Rooms</DialogTitle>
          <Description>
            Select a room and join by clicking the join room button to start
            chatting!
          </Description>
          <div className="h-2/3 max-h-2/3 bg-slate-200 p-2 flex flex-col gap-2 overflow-y-auto">
            {roomsData.map((room, idx) => (
              <p key={room._id}>{room.name}</p>
            ))}
            {roomsData.map((room) => (
              <p key={room._id}>{room.name}</p>
            ))}
            {roomsData.map((room) => (
              <p key={room._id}>{room.name}</p>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              className=" bg-slate-200 py-3 w-1/4 rounded-sm"
              onClick={handleJoin}
            >
              Join Room
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

RoomsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  roomsData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
