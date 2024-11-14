import React from 'react';
import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import getHealth from './services/test.api.js';
import logger from '../config/logger.js';
import FontAwesomeIcon from './components/common/Icon.jsx';
import ServerTest from './components/common/ServerTest.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<ServerTest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
