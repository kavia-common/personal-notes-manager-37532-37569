import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// Import the Supabase client module to ensure it's bundled and ready for future use.
// This does not execute any calls; it only validates configuration at runtime when used.
import './lib/supabaseClient';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
