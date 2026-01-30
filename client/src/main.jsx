import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: { borderRadius: '12px' },
        }}
      />
    </HelmetProvider>
  </React.StrictMode>
);
