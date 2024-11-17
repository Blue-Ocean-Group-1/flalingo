import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

function MainLanguageSelect({ user }) {
  const handleClick = (language) => {};

  return (
    user && (
      <Menu>
        <MenuButton className="text-4xl text-jet">
          {`${user.activeLanguages[0]}`}
        </MenuButton>
        <MenuItems anchor="bottom">
          {user.allLanguages.map(
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
        </MenuItems>
      </Menu>
    )
  );
}

export default MainLanguageSelect;
