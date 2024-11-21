// src/imports.js

// React imports
export { default as React } from 'react';
export { useState, useEffect } from 'react';

// Router imports
export { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Auth imports
export { default as AuthProvider } from './context/authContext.jsx';
export { default as ProtectedRoute } from './components/ProtectedRoute.jsx';

// HeadlessUI imports
export { Dialog } from '@headlessui/react';

// Components
export { default as LoginButton } from './components/layout/LoginButton.jsx';
export { default as LogoutButton } from './components/layout/LogoutButton.jsx';
export { default as SignupButton } from './components/layout/SignupButton.jsx';
export { default as FontAwesomeIcon } from './components/common/Icon.jsx';
export { default as ServerTest } from './components/common/ServerTest.jsx';
// export { default as LoadingOverlay } from './components/common/LoadingOverlay.jsx';

// Services and utilities
export { default as getHealth } from './services/test.api.js';
export { default as logger } from '../config/logger.js';

// Pages
export { default as Login } from './pages/Login.jsx';
export { default as Signup } from './pages/Signup.jsx';
export { default as LandingPage } from './pages/LandingPage.jsx'; // eslint-disable-line
export { default as Homepage } from './pages/HomePage.jsx';
export { default as FlashcardsPage } from './pages/FlashcardsPage.jsx';
export { default as ConversationRoomsPage } from './pages/ConversationRoomsPage.jsx';
export { default as AchievementsPage } from './pages/AchievementsPage.jsx';
export { default as SupportPage } from './pages/SupportPage.jsx';
export { default as ProfilePage } from './pages/ProfilePage.jsx';
export { default as NotFoundPage } from './pages/NotFoundPage.jsx';
export { default as ChatRoomPage } from './pages/ChatRoomPage.jsx';
