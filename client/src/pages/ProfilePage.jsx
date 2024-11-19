import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DefaultPageLayout from '../components/layout/DefaultPageLayout';
import { env } from '../../config/env.js';
import logger from '../../config/logger.js';
import flagObject from '../assets/Flags/flagObject.js';

export default function ProfilePage() {
  const [selectedImg, setSelectedImg] = useState(null);
  const [displayedImg, setDisplayedImg] = useState(
    'https://muffinman.io/img/image-resize/rickmorty-250x250.jpg',
  );
  const [countryFlag, setCountryFlag] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Emma',
    username: '@emma',
    country: 'China',
    phoneNumber: '(123)-456-7890',
    gender: 'Female',
    email: 'emmaemma0768@icloud.com',
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({ ...notificationSettings, [name]: checked });
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
      const flagMap = {
        China: 'Chinese.png',
        'Saudi Arabia': 'Arabic.png',
        // Add other countries and their corresponding flag filenames here
      };
      const flag = await import(`../../assets/flags/${flagObject[country]}`);

      setCountryFlag(flag.default);
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
        setDisplayedImg(response.data.url);
      })
      .catch((err) => {
        logger.error('error uploading image', err);
      });
  };

  return (
    <DefaultPageLayout>
      <div className="max-w-xl mx-auto">
        <br />
        <br />
        <button
          className="-ml-5 border border-white"
          onClick={() => setEditMode(true)}
        >
          Edit
        </button>
        <button
          className="ml-25 border border-white"
          onClick={() => setEditMode(false)}
        >
          save
        </button>
        <div className="flex ml-10">
          <div className="relative mr-50">
            <img
              src={`${displayedImg}`}
              alt="Profile-pic"
              className="w-36 h-36 rounded-full object-cover mr-48"
            />
            <img
              src={countryFlag}
              alt="Flag"
              className="w-8 h-8 absolute bottom-12 left-28"
            />
            {editMode && (
              <form onSubmit={uploadImage}>
                <input
                  type="file"
                  accept="image/*"
                  className="block mt-2"
                  id="profile-pic"
                  onChange={(event) => {
                    setSelectedImg(event.target.files[0]);
                  }}
                />
                <button type="submit" className="mt-2 ml-5 border border-white">
                  upload
                </button>
              </form>
            )}
          </div>
          <div className="relative ml-50">
            <form>
              {editMode ? (
                <div className="flex items-center mb-2">
                  <label htmlFor="name" className="mr-2 font-bold">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={profileData.name}
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="block w-full"
                  />
                </div>
              ) : (
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-bold">Name</span>
                  <span>{profileData.name}</span>
                </div>
              )}

              {editMode ? (
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
                    className="block w-full"
                    onChange={handleInputChange}
                  />
                </div>
              ) : (
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-bold">Username</span>
                  <span>{profileData.username}</span>
                </div>
              )}

              {editMode ? (
                <div className="flex items-center mb-2">
                  <label htmlFor="country" className="mr-2 font-bold">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    className="block w-full"
                    value={profileData.country}
                    onChange={handleInputChange}
                  >
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="China">China</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Greece">Greece</option>
                    <option value="Israel">Israel</option>
                    <option value="India">India</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Italy">Italy</option>
                    <option value="Japan">Japan</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Norway">Norway</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Romania">Romania</option>
                    <option value="Russia">Russia</option>
                    <option value="Spain">Spain</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="Vietnam">Vietnam</option>
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
                    value={profileData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-auto"
                  />
                </div>
              ) : (
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-bold">Phone Number</span>
                  <span>{profileData.phoneNumber}</span>
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
                    className="block w-full"
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
                    className="block w-full"
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
        <div className="mt-40">
          <h1 className="font-bold text-2xl">Notification Settings</h1>
          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <input
                type="checkbox"
                id="dailyReminder"
                name="dailyReminder"
                checked={notificationSettings.dailyReminder}
                onChange={handleCheckboxChange}
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
              />
              <label htmlFor="promotion" className="ml-2">
                Receive promotion alerts
              </label>
            </div>
            <button
              type="submit"
              className="mt-4 border border-white px-4 py-2"
            >
              Update your settings
            </button>
          </form>
        </div>
      </div>
    </DefaultPageLayout>
  );
}
