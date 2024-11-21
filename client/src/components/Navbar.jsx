import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import useAuth from '../hooks/useAuth.jsx';
import { Link } from 'react-router-dom';
import FontAwesomeIcon from './common/Icon.jsx';
import Brand from './common/Brand.jsx';

const navigation = [
  { name: 'Flashcards', href: '/flashcards', current: false },
  { name: 'Conversation Rooms', href: '/conversation_rooms', current: false },
  { name: 'Achievements', href: '/achievements', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// TODO: LOGOUT BUTTON FUNCTIONALITY
// TODO: FIX SELECTED PAGE STATE INDICATOR

export default function Navbar() {
  const { logout } = useAuth();
  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-40 w-full lex-none duration-500 lg:z-50 "
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ">
        <div className="relative flex h-12 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <div
                aria-hidden="true"
                className="block size-6 group-data-[open]:hidden"
              >
                <FontAwesomeIcon icon="fa-solid fa-bars" />
              </div>
              <div
                aria-hidden="true"
                className="hidden size-6 group-data-[open]:block"
              >
                <FontAwesomeIcon icon="fa-solid fa-x" />
              </div>
            </DisclosureButton>
          </div>
          <div className="flex flex-1 w-full items-center justify-center sm:items-stretch sm:justify-between">
            <div className="flex sm:justify-start shrink-0 items-center">
              <Brand />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    aria-current={item.current ? 'page' : undefined}
                    key={item.name}
                    to={item.href}
                    relative="path"
                    className={classNames(
                      item.current
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium',
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            {/* This will need to be swapped out for login/signup button */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full text-sm">
                  <p className="font-bold">Account</p>
                </MenuButton>
              </div>
              <MenuItems
                anchor="bottom "
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    Your Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to="/support"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    Support
                  </Link>
                </MenuItem>
                <MenuItem>
                  <div
                    onClick={logout}
                    tabIndex="0"
                    role="button"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        logout();
                      }
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none cursor-pointer"
                  >
                    Logout
                  </div>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
