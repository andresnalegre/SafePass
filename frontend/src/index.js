import React, { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './styles/Theme'; 
import App from './App';
import Notifications from './components/Notifications';
import './styles/styles.css';

const container = document.getElementById('root');
const root = createRoot(container);

const Index = () => {
  const notificationsRef = useRef();

  return (
    <React.StrictMode>
      <BrowserRouter basename="/SafePass">
        <ThemeProvider>
          <App />
          <Notifications ref={notificationsRef} />
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

root.render(<Index />);