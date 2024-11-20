import React, { useState } from 'react';

function PhoneNumberInput({ phoneNumber, setPhoneNumber }) {
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handleChange = (event) => {
    const inputtedPhoneNumber = event.target.value;
    setPhoneNumber(formatPhoneNumber(inputtedPhoneNumber));
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="phoneNumber"
        className="block text-sm font-medium text-gray-700"
      >
        Phone Number:{' '}
      </label>
      <input
        id="phone"
        type="tel"
        value={phoneNumber}
        onChange={handleChange}
        required
        placeholder="(123) 456-7890"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
}

export default PhoneNumberInput;
