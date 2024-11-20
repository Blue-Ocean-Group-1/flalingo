import React from 'react';

import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import useUserData from '../../hooks/useUserData';

function MainLanguageSelect({ user }) {
  const [, , , updateUser, ,] = useUserData();
  const handleClick = (language) => {
    updateUser({ activeLanguages: [language] });
  };

  return (
    user && (
      <Menu
        as="div"
        className="relative text-3xl text-jet font-semibold bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-300"
      >
        <MenuButton className="relative flex rounded-full text-4xl">
          {`${user.activeLanguages[0]}`}
        </MenuButton>
        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-jet py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          {user &&
            user.allLanguages.map(
              (language) =>
                language !== user.activeLanguages[0] && (
                  <button
                    className="text-4xl text-jet inline-flex items-center gap-2 rounded-md bg-gray-300 py-1.5 px-3 font-semibold shadow-inner shadow-white/10 focus:outline-none"
                    key={language}
                    onClick={() => handleClick(language)}
                  >
                    {language}
                  </button>
                ),
            )}
          <div className="p-4">
            <button className=" rounded-xl bg-argentBlue text-jet m-2 font-bold hover:scale-105 text-base">
              Start New Language
            </button>
          </div>
        </MenuItems>
      </Menu>
    )
  );
}

export default MainLanguageSelect;
