import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot instead of render
import App from './App';
import './index.css'; // Import your CSS file
import { AuthProvider } from './context/AuthContext';

// Get the root element
const container = document.getElementById('root');
// Create a root
const root = createRoot(container);
// Render the app
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);