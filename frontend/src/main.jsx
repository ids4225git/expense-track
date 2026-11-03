// =============================================================
// MAIN.JSX — React Entry Point
// =============================================================
// This file is where React starts. It takes the App component
// and renders it into the HTML page (into the div with id="root").
// =============================================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
