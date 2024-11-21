import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DefaultPageLayout from '../components/layout/DefaultPageLayout';
import { env } from '../../config/env.js';
import logger from '../../config/logger.js';
import { useUserData } from '../hooks/useUserData.jsx';

const COUNTRY_DATA = {
  Bangladesh: 'Bengali',
  China: 'Chinese',
  'Czech Republic': 'Czech',
  Denmark: 'Danish',
  Finland: 'Finnish',
  France: 'French',
  Germany: 'German',
  Greece: 'Greek',
  India: 'Hindi',
  Indonesia: 'Indonesian',
  Israel: 'Hebrew',
  Italy: 'Italian',
  Japan: 'Japanese',
  Malaysia: 'Malay',
  Netherlands: 'Dutch',
  Norway: 'Norwegian',
  Poland: 'Polish',
  Portugal: 'Portuguese',
  Romania: 'Romanian',
  Russia: 'Russian',
  'Saudi Arabia': 'Arabic',
  'South Korea': 'Korean',
  Spain: 'Spanish',
  Sweden: 'Swedish',
  Thailand: 'Thai',
  Turkey: 'Turkish',
  Ukraine: 'Ukrainian',
  Vietnam: 'Vietnamese',
};

export default function ProfilePage() {
  const { userData, updateUser } = useUserData(); // eslint-disable-line no-unused-vars
  console.log('userData', userData);
  const [selectedImg, setSelectedImg] = useState(null);
  const [displayedImg, setDisplayedImg] = useState('');
  const [countryFlag, setCountryFlag] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    country: '',
    phoneNumber: '',
    gender: '',
    email: '',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    dailyReminder: false,
    weeklyReminder: false,
    monthlyReport: false,
    promotion: false,
  });

  useEffect(() => {
    importFlag(profileData.country);
  }, [profileData.country]);

  useEffect(() => {
    setProfileData({
      name: userData && userData.name,
      username: userData && `@${userData.username}`,
      country: userData && userData.demographics.country,
      phoneNumber: userData && userData.phoneNumber,
      gender: userData && userData.demographics.gender,
      email: userData && userData.email,
    });
    setDisplayedImg(
      userData?.profilePicture === null
        ? 'http://res.cloudinary.com/emmagangl/image/upload/v1732181364/Profile_avatar_placeholder_large_tjdbsz.png'
        : userData?.profilePicture,
    );
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({ ...notificationSettings, [name]: checked });
  };

  const handleSaveInfo = () => {
    setEditMode(false);
    console.log('userData', userData);
    const updatedInfo = {
      name: profileData.name,
      username: profileData.username,
      demographics: {
        country: profileData.country,
        gender: profileData.gender,
      },
      phoneNumber: profileData.phoneNumber,
      email: profileData.email,
    };
    updateUser(updatedInfo);
  };
  const phoneNumberFormat = (phoneNumber) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Notification Settings:', notificationSettings);
    //TODO: MAKE A PUT REQUEST TO UPDATE USER NOTIFICATIONSETTINGS

    const msg = {
      to: profileData.email,
      subject: 'Subscription Confirmation',
      text: 'Thank you for subscribing the following service(s): ',
      html: '<p>Thank you for subscribing the following service(s):  </p>',
    };

    if (
      !notificationSettings.dailyReminder &&
      !notificationSettings.weeklyReminder &&
      !notificationSettings.monthlyReport &&
      !notificationSettings.promotion
    ) {
      msg.text = 'You have unsubscribed from all services.';
      msg.html = '<p>You have unsubscribed from all services.</p>';
    }
    if (notificationSettings.dailyReminder) {
      msg.text += 'daily reminder alert';
      msg.html += '<p style="font-weight: bold;">daily reminder alert</p>';
      axios
        .post(`${env.API_URL}/sendemail/schedule-daily`, {
          email: profileData.email,
        })
        .then((response) => {
          console.log('Daily reminder scheduled:', response.data);
        })
        .catch((error) => {
          console.error('Error scheduling daily reminder:', error);
        });
    } else {
      axios
        .post(`${env.API_URL}/sendemail/unschedule-daily`, {
          email: profileData.email,
        })
        .then((response) => {
          console.log('Daily reminder unscheduled:', response.data);
        })
        .catch((error) => {
          console.error('Error unscheduling daily reminder:', error);
        });
    }
    if (notificationSettings.weeklyReminder) {
      msg.text += 'weekly goal reminder alert';
      msg.html +=
        '<p style="font-weight: bold;">weekly goal reminder alert</p>';
      axios
        .post(`${env.API_URL}/sendemail/schedule-weekly`, {
          email: profileData.email,
        })
        .then((response) => {
          console.log('Weekly reminder scheduled:', response.data);
        })
        .catch((error) => {
          console.error('Error scheduling weekly reminder:', error);
        });
    } else {
      axios
        .post(`${env.API_URL}/sendemail/unschedule-weekly`, {
          email: profileData.email,
        })
        .then((response) => {
          console.log('Weekly reminder unscheduled:', response.data);
        })
        .catch((error) => {
          console.error('Error unscheduling weekly reminder:', error);
        });
    }
    if (notificationSettings.monthlyReport) {
      msg.text += 'monthly progress report';
      msg.html += '<p style="font-weight: bold;">monthly progress report</p>';
      axios
        .post(`${env.API_URL}/sendemail/schedule-monthly`, {
          email: profileData.email,
        })
        .then((response) => {
          console.log('Monthly progress report scheduled:', response.data);
        })
        .catch((error) => {
          console.error('Error scheduling monthly progress report:', error);
        });
    } else {
      axios
        .post(`${env.API_URL}/sendemail/unschedule-monthly`, {
          email: profileData.email,
        })
        .then((response) => {
          console.log('Monthly progress report unscheduled:', response.data);
        })
        .catch((error) => {
          console.error('Error unscheduling monthly progress report:', error);
        });
    }
    if (notificationSettings.promotion) {
      msg.text += 'promotion alert';
      msg.html += '<p style="font-weight: bold;">promotion alert</p>';
      axios
        .post(`${env.API_URL}/sendemail/schedule-promotion`, {
          email: profileData.email,
        })
        .then((response) => {
          console.log('Promotion alert scheduled:', response.data);
        })
        .catch((error) => {
          console.error('Error scheduling promotion alert:', error);
        });
    } else {
      axios
        .post(`${env.API_URL}/sendemail/unschedule-promotion`, {
          email: profileData.email,
        })
        .then((response) => {
          console.log('Promotion alert unscheduled:', response.data);
        })
        .catch((error) => {
          console.error('Error unscheduling promotion alert:', error);
        });
    }
    axios
      .post(`${env.API_URL}/sendemail/confirmation`, msg)
      .then((response) => {
        console.log('Email sent:', response.data);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };

  const importFlag = async (country) => {
    try {
      const flag = `/Flags/${COUNTRY_DATA[country]}.png`;
      setCountryFlag(flag);
    } catch (error) {
      console.error('Error loading flag:', error);
    }
  };

  const uploadImage = (e) => {
    e.preventDefault();
    logger.debug('selected image: ', selectedImg);
    const formData = new FormData();
    formData.append('file', selectedImg);
    formData.append('upload_preset', 'blueocean');
    axios
      .post(env.CLOUDINARY_API_LINK, formData)
      .then((response) => {
        logger.debug('uploaded picture response: ', response.data);
        // TODO: make put request to api update profile
        updateUser({ profilePicture: response.data.url });
        setDisplayedImg(response.data.url);
      })
      .catch((err) => {
        logger.error('error uploading image', err);
      });
  };

  return (
    <DefaultPageLayout>
      <div className="max-w-4xl mx-auto text-jet min-h-screen">
        <br />
        <br />
        <h1 className="text-3xl -ml-5 text-3xl font-semibold mb-10">Profile</h1>
        <div className="flex ml-0 mr-28 border-2 border-white bg-white shadow-2xl rounded-lg h-96">
          <div className="relative mr-50">
            <div className="relative ml-2 mt-4">
              <img
                src={`${displayedImg}`}
                alt="Profile-pic"
                className="w-42 h-42 rounded-full object-cover mr-48 ml-10 mb-4"
                style={{ width: '260px', height: '260px' }}
              />
              <img
                src={countryFlag}
                alt="Flag"
                className="w-15 h-10 absolute bottom-2 left-64 border border-gray-400 rounded-sm antialiasing"
              />
            </div>

            {editMode && (
              <form onSubmit={uploadImage}>
                <input
                  type="file"
                  accept="image/*"
                  className="block mt-4 ml-28"
                  id="profile-pic"
                  onChange={(event) => {
                    setSelectedImg(event.target.files[0]);
                  }}
                />
                <button
                  type="submit"
                  className="mt-2 ml-28 mb-4 bg-argentBlue p-1 rounded-md px-2"
                >
                  upload
                </button>
              </form>
            )}
          </div>
          <div className="relative mr-20 mt-16">
            <form>
              {editMode ? (
                <div className="flex items-center mb-2">
                  <label htmlFor="name" className="mr-1 font-bold">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={profileData.name}
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="block w-full bg-platinum px-1"
                  />
                </div>
              ) : (
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-bold">Name</span>
                  <span>{profileData.name}</span>
                </div>
              )}

              {/* {editMode ? (
                <div className="flex items-center mb-2">
                  <label htmlFor="username" className="mr-2 font-bold">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder={profileData.username}
                    value={profileData.username}
                    className="block w-full bg-platinum px-1"
                    onChange={handleInputChange}
                  />
                </div>
              ) : ( */}
              <div className="flex items-center mb-2">
                <span className="mr-2 font-bold">Username</span>
                <span>{profileData.username}</span>
              </div>

              {editMode ? (
                <div className="flex items-center mb-2 relative">
                  <label htmlFor="country" className="mr-2 font-bold">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    className="block w-full bg-platinum px-1"
                    value={profileData.country}
                    onChange={handleInputChange}
                  >
                    {Object.keys(COUNTRY_DATA).map((country, idx) => (
                      <option key={`${country}-${idx}`} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-bold">Country</span>
                  <span>{profileData.country}</span>
                </div>
              )}

              {editMode ? (
                <div className="flex items-center mb-2">
                  <label htmlFor="phoneNumber" className="mr-2 font-bold">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    placeholder={profileData.phoneNumber}
                    value={phoneNumberFormat(profileData.phoneNumber)}
                    onChange={handleInputChange}
                    className="block w-auto bg-platinum px-1"
                  />
                </div>
              ) : (
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-bold whitespace-nowrap">
                    Phone Number
                  </span>
                  <span className="whitespace-nowrap">
                    {phoneNumberFormat(profileData.phoneNumber)}
                  </span>
                </div>
              )}

              {editMode ? (
                <div className="flex items-center mb-2">
                  <label htmlFor="gender" className="mr-2 font-bold">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className="block w-full bg-platinum px-1"
                    value={profileData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-bold">Gender</span>
                  <span>{profileData.gender}</span>
                </div>
              )}

              {editMode ? (
                <div className="flex items-center mb-2">
                  <label htmlFor="email" className="mr-2 font-bold">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={profileData.email}
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="block w-full bg-platinum px-1"
                  />
                </div>
              ) : (
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-bold">Email</span>
                  <span>{profileData.email}</span>
                </div>
              )}
            </form>
          </div>
        </div>
        <div className="mr-28 mt-2 flex justify-end">
          {editMode && (
            <button
              className="bg-argentBlue bg-argentBlue px-2 h-8 rounded-md mb-2 mr-2"
              onClick={handleSaveInfo}
            >
              Save
            </button>
          )}
          <button
            className="bg-argentBlue px-2 h-8 mr-1 rounded-md mb-2"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        </div>
        <div className="mt-8">
          <h1 className="font-bold text-2xl">Notification Settings</h1>
          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <input
                type="checkbox"
                id="dailyReminder"
                name="dailyReminder"
                checked={notificationSettings.dailyReminder}
                onChange={handleCheckboxChange}
                className="appearance-none bg-white border border-gray-300 rounded-sm w-4 h-4 checked:after:content-['✔'] checked:after:block checked:after:text-argentBlue checked:after:text-center checked:after:font-bold"
              />
              <label htmlFor="dailyReminder" className="ml-2">
                Receive daily reminder email alerts
              </label>
            </div>
            <div className="mb-2">
              <input
                type="checkbox"
                id="weeklyReminder"
                name="weeklyReminder"
                checked={notificationSettings.weeklyReminder}
                onChange={handleCheckboxChange}
                className="appearance-none bg-white border border-gray-300 rounded-sm w-4 h-4 checked:after:content-['✔'] checked:after:block checked:after:text-argentBlue checked:after:text-center checked:after:font-bold"
              />
              <label htmlFor="weeklyReminder" className="ml-2">
                Receive weekly goal reminder email alerts
              </label>
            </div>
            <div className="mb-2">
              <input
                type="checkbox"
                id="monthlyReport"
                name="monthlyReport"
                checked={notificationSettings.monthlyReport}
                onChange={handleCheckboxChange}
                className="appearance-none bg-white border border-gray-300 rounded-sm w-4 h-4 checked:after:content-['✔'] checked:after:block checked:after:text-argentBlue checked:after:text-center checked:after:font-bold"
              />
              <label htmlFor="monthlyReport" className="ml-2">
                Receive monthly progress report email alerts
              </label>
            </div>
            <div className="mb-2">
              <input
                type="checkbox"
                id="promotion"
                name="promotion"
                checked={notificationSettings.promotion}
                onChange={handleCheckboxChange}
                className="appearance-none bg-white border border-gray-300 rounded-sm w-4 h-4 checked:after:content-['✔'] checked:after:block checked:after:text-argentBlue checked:after:text-center checked:after:font-bold"
              />
              <label htmlFor="promotion" className="ml-2">
                Receive promotion alerts
              </label>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="px-4 h-10 bg-argentBlue text-lg font-semibold rounded-md"
              >
                Update your settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultPageLayout>
  );
}
