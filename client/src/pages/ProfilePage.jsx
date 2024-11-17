import React, { useState } from 'react';
import axios from 'axios';
import DefaultPageLayout from '../components/layout/DefaultPageLayout';
import { env } from '../../config/env.js';
import logger from '../../config/logger.js';

export default function ProfilePage() {
  const [selectedImg, setSelectedImg] = useState(null);
  const [displayedImg, setDisplayedImg] = useState(
    'https://muffinman.io/img/image-resize/rickmorty-250x250.jpg',
  );
  const [editMode, setEditMode] = useState(false);

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
    <div className="flex justify-center">
      <DefaultPageLayout>
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
              src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
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
                    type="text"
                    placeholder="Name"
                    className="block w-full"
                  />
                </div>
              ) : (
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-bold">Name</span>
                  <span>Emma</span>
                </div>
              )}

              {editMode ? (
                <div className="flex items-center mb-2">
                  <label htmlFor="@username" className="mr-2 font-bold">
                    @username
                  </label>
                  <input
                    id="@username"
                    type="text"
                    placeholder="@username"
                    className="block w-full"
                  />
                </div>
              ) : (
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-bold">@username</span>
                  <span>@emma</span>
                </div>
              )}

              {editMode ? (
                <div className="flex items-center mb-2">
                  <label htmlFor="Country" className="mr-2 font-bold">
                    Country
                  </label>
                  <input
                    id="Country"
                    type="text"
                    placeholder="Country"
                    className="block w-full"
                  />
                </div>
              ) : (
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-bold">Country</span>
                  <span>USA</span>
                </div>
              )}

              {editMode ? (
                <div className="flex items-center mb-2">
                  <label htmlFor="Phone Number" className="mr-2 font-bold">
                    Phone Number
                  </label>
                  <input
                    id="Phone Number"
                    type="text"
                    placeholder="(999)-999-9999"
                    className="w-auto"
                  />
                </div>
              ) : (
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-bold">Phone Number</span>
                  <span>(123)-456-7890</span>
                </div>
              )}

              {editMode ? (
                <div className="flex items-center mb-2">
                  <label htmlFor="gender" className="mr-2 font-bold">
                    Gender
                  </label>
                  <select id="gender" className="block w-full" defaultValue="">
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-bold">Gender</span>
                  <span>Female</span>
                </div>
              )}

              {editMode ? (
                <div className="flex items-center mb-2">
                  <label htmlFor="email" className="mr-2 font-bold">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    className="block w-full"
                  />
                </div>
              ) : (
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-bold">Email</span>
                  <span>emma@example.com</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </DefaultPageLayout>
    </div>
  );
}
