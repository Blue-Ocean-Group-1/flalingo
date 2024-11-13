import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import getHealth from './services/test.api.js';
import logger from '../config/logger.js';
import FontAwesomeIcon from './components/common/Icon.jsx';
import ServerTest from './components/common/ServerTest.jsx';

function App() {
  return (
    <div className="App">
      <ServerTest />
    </div>
  );
}

export default App;
