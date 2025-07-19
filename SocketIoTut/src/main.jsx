import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-xl shadow-xl p-4 flex flex-col">
        <App />
      </div>
    </div>
  </React.StrictMode>
);
