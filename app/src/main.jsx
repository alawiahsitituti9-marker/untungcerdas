import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './gaya/token.css';
import './gaya/dasar.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
