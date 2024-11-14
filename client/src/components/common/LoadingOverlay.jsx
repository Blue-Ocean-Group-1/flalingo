import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LoadingOverlay = ({ isLoading }) => {
  return (
    <Transition
      as={Fragment}
      show={isLoading}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8 shadow-xl">
          <FontAwesomeIcon
            icon="fa-solid fa-spinner"
            className="text-indigo-600 text-4xl animate-spin"
          />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    </Transition>
  );
};

LoadingOverlay.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default LoadingOverlay;
