import {
  React,
  Router,
  Routes,
  Route,
  ServerTest,
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
} from './imports';
import useAuth from './hooks/useAuth';

function App() {
  const { isAuthenticated } = useAuth();
  console.log('isAuthenticated', isAuthenticated);

  return (
    <Router>
      <div className="App">
        {!isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        ) : (
          <Routes>
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
        )}
      </div>
    </Router>
  );
}

export default App;
