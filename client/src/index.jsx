import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { library } from '@fortawesome/fontawesome-svg-core';
import { all } from '@awesome.me/kit-5597d7fcb7/icons';
import { AuthProvider } from './imports.js';

library.add(...all);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
