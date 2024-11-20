import React, { useState, useEffect } from 'react';
import { fetchLanguageNames } from '../../services/language.api';
import logger from '../../../config/logger.js';
import useUserData from '../../hooks/useUserData.jsx';
import PhoneNumberInput from '../common/PhoneNumberInput.jsx';

const countries = [
  'Bangladesh',
  'China',
  'Czech Republic',
  'Denmark',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'India',
  'Indonesia',
  'Israel',
  'Italy',
  'Japan',
  'Malaysia',
  'Netherlands',
  'Norway',
  'Poland',
  'Portugal',
  'Romania',
  'Russia',
  'Saudi Arabia',
  'South Korea',
  'Spain',
  'Sweden',
  'Thailand',
  'Turkey',
  'Ukraine',
  'Vietnam',
];

const OnboardingModal = ({ isOpen, onClose }) => {
  const [userData, loading, error, updateUser] = useUserData(); // eslint-disable-line no-unused-vars
  const [languageOptions, setLanguageOptions] = useState([]);
  const [formData, setFormData] = useState({
    nativeCountry: '',
    phoneNumber: '',
    gender: '',
    language: '',
  });

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languages = await fetchLanguageNames();
        logger.debug('OnboardingModal.jsx: Fetched languages:', languages);
        setLanguageOptions(languages);
      } catch (error) {
        logger.error(error);
      }
    };

    fetchLanguages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const formatFormData = (data) => {
    const { nativeCountry, phoneNumber, gender, language } = data;
    const updatedData = {
      phoneNumber,
      demographics: {
        country: nativeCountry,
        gender,
      },
      activeLanguages: [language],
      allLanguages: [language],
    };
    return updatedData;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = formatFormData(formData);
    updateUser(updatedData);
    onClose();
  };

  const handlePhoneNumberChange = (value) => {
    setFormData({
      ...formData,
      phoneNumber: value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
          Welcome! Let&apos;s get started
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="nativeCountry"
              className="block text-sm font-medium text-gray-700"
            >
              Native Country:
            </label>
            <select
              id="nativeCountry"
              name="nativeCountry"
              value={formData.nativeCountry}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a country</option>
              {countries.map((country, i) => (
                <option key={country + i} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <PhoneNumberInput
            phoneNumber={formData.phoneNumber}
            setPhoneNumber={handlePhoneNumberChange}
          />
          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700"
            >
              Language to Learn:
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a language</option>
              {languageOptions.map((language, i) => (
                <option key={language + i} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingModal;