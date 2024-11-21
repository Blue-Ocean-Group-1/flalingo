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
  Homepage,
  FlashcardsPage,
  ConversationRoomsPage,
  AchievementsPage,
  SupportPage,
  ProfilePage,
  NotFoundPage,
  ChatRoomPage,
  LandingPage,
} from './imports';

import { UserDataProvider } from './hooks/useUserData'; // Import the UserDataProvider

function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* <Route path="/" element={<Login />} /> */}
              <Route path="/" element={<LandingPage />} />
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
                path="/conversation_rooms/:roomId"
                element={
                  <ProtectedRoute>
                    <ChatRoomPage />
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
      </UserDataProvider>
    </AuthProvider>
  );
}

export default App;
