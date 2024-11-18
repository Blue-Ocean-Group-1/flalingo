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
  CalendarPage,
  AchievementsPage,
  SupportPage,
  ProfilePage,
  NotFoundPage,
} from './imports';

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
