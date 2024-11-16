import {
  React,
  Router,
  Routes,
  Route,
  ServerTest,
  AuthProvider,
  ProtectedRoute,
  Login,
  Signup,
} from './imports';
import LandingPage from './pages/LandingPage.jsx'; // eslint-disable-line
import Homepage from './pages/HomePage.jsx';
import FlashcardsPage from './pages/FlashcardsPage.jsx';
import ConversationRoomsPage from './pages/ConversationRoomsPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import AchievementsPage from './pages/AchievementsPage.jsx';
import SupportPage from './pages/SupportPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

import NotFoundPage from './pages/NotFoundPage.jsx';
// ? @skylayreiner — can we move these to imports.js? @EmmaG2020 you do it

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Homepage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flashcards"
              element={
                <ProtectedRoute>
                  <FlashcardsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/conversation_rooms"
              element={
                <ProtectedRoute>
                  <ConversationRoomsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CalendarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/achievements"
              element={
                <ProtectedRoute>
                  <AchievementsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/support"
              element={
                <ProtectedRoute>
                  <SupportPage />
                </ProtectedRoute>
              }
            />
            <Route path="/*" element={<NotFoundPage />} />
            <Route
              path="/server_test"
              element={
                <ProtectedRoute>
                  <ServerTest />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
