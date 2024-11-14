import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App.jsx';
import { library } from '@fortawesome/fontawesome-svg-core';
import { all } from '@awesome.me/kit-5597d7fcb7/icons';

library.add(...all);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-uhp1wd5lz84zsq4b.us.auth0.com"
      clientId="VqWFyqtKlRUqGFrrjahRkWxXBJ37rWrU"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
    ,
  </StrictMode>,
);
