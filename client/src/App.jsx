import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import ServerTest from './components/common/ServerTest.jsx';
import { redirectIfNoUser } from './utils/loaders.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/server_test"
            element={<ServerTest />}
            loader={redirectIfNoUser}
          />
          <Route path="/server_test" element={<ServerTest />} />
          <Route path="/flashcards" element={<ServerTest />} />

          {/* <Route path="/conversations_rooms" element={insert your page here} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
// <Router>
//   <div className="App">
//     <Routes>
//       <Route
//         path="/"
//         element={
//           <ProtectedRoute>
//             <LandingPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/flashcards"
//         element={
//           <ProtectedRoute>
//             <FlashcardsPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/conversations_rooms"
//         element={
//           <ProtectedRoute>
//             <ServerTest />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/server_test"
//         element={
//           <ProtectedRoute>
//             <ServerTest />
//           </ProtectedRoute>
//         }
//       />

//       {/* <Route path="/conversations_rooms" element={insert your page here} /> */}
//     </Routes>
