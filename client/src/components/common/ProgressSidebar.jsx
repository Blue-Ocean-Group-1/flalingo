export default function ProgressSidebar() {
  return (
    <div className="flex-col space-y-2 my-6 mx-auto ">
      <div className="p-4 text-black bg-white rounded-md shadow-md">
        <div className="flex flex-col space-y-3 py-2">
          <h2 className="text-lg font-medium">Daily Goals</h2>

          <div className="inline-flex gap-1 items-center">
            <CheckMark />
            <p className="text-sm">Login Daily</p>
          </div>
          <div className="inline-flex gap-1 items-center">
            <XCircle />
            <p className="text-sm">Join a Conversation Room</p>
          </div>
          <div className="inline-flex gap-1 items-center">
            <XCircle />
            <p className="text-sm">Complete a flashcard deck</p>
          </div>
        </div>
      </div>
      <div className="p-4 text-black bg-white rounded-md shadow-md">
        <h2 className="font-medium pb-2">Daily Quote</h2>
        <div className="flex flex-col space-y-2">
          <p className="text-sm italic">
            "La vida es 10% lo que me ocurre y 90% cómo reacciono ante ello."
            {<br />}
          </p>
          <p className="text-sm italic">
            translation: "Life is 10% what happens to me and 90% how I react to
            it."
          </p>
          <p className="text-xs pb-2">– Charles R. Swindoll</p>
        </div>
      </div>
    </div>
  );
}

const CheckMark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-8 text-pistachio"
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </svg>
);

const XCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-8 text-wisteria"
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
      clipRule="evenodd"
    />
  </svg>
);
