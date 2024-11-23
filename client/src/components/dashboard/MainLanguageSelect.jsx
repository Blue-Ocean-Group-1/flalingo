import React from 'react';

import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import { useUserData } from '../../hooks/useUserData';
import FontAwesomeIcon from '../common/Icon.jsx';

function MainLanguageSelect({ user, openAddLang }) {
  const { userData, updateUser } = useUserData();
  const handleClick = async (language) => {
    await updateUser({ activeLanguages: [language] });
  };

  return (
    user && (
      <Menu
        as="div"
        className="relative text-3xl text-jet font-semibold bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-300"
      >
        <MenuButton className="relative flex text-4xl w-full justify-between items-center pr-2">
          {user.activeLanguages[0] === undefined ? '' : user.activeLanguages[0]}
          <FontAwesomeIcon
            icon="fa-solid fa-chevron-down"
            className="text-jet size-7"
          />
        </MenuButton>
        <MenuItems
          transition
          modal={false}
          className="absolute left-0 w-full z-10 mt-2 origin-top-right rounded-md bg-jet p-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in flex flex-col justify-center gap-1"
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
          <button
            className="rounded-md bg-argentBlue text-jet p-2 font-bold text-base"
            onClick={() => {
              openAddLang();
            }}
          >
            Start New Language
          </button>
        </MenuItems>
      </Menu>
    )
  );
}

export default MainLanguageSelect;
