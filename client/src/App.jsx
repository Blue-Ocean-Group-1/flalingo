import { React, Router, Routes, Route, ServerTest } from './imports';
import LandingPage from './pages/LandingPage.jsx';
import Homepage from './pages/HomePage.jsx';
import FlashcardsPage from './pages/FlashcardsPage.jsx';
import ConversationRoomsPage from './pages/ConversationRoomsPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/server_test"
            element={
              <ProtectedRoute>
                <ServerTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/welcome"
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
            path="/account/your_profile"
            element={
              <ProtectedRoute>
                <ServerTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
