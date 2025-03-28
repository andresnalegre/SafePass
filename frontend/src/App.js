import React, { useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgetPassword from './pages/ForgetPassword';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import Notifications from './components/Notifications';
import { ThemeProvider } from './styles/Theme';

function App() {
  const notificationsRef = useRef();

  const WithFooter = ({ children }) => (
    <div>
      {children}
      <Footer />
    </div>
  );

  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<Navigate to="/" />} />
        <Route
          path="/"
          element={
            <ThemeProvider>
              <WithFooter>
                <Dashboard notificationsRef={notificationsRef} />
              </WithFooter>
            </ThemeProvider>
          }
        />
        <Route
          path="/about"
          element={
            <ThemeProvider>
              <WithFooter>
                <About notificationsRef={notificationsRef} />
              </WithFooter>
            </ThemeProvider>
          }
        />
        <Route
          path="/profile"
          element={
            <ThemeProvider>
              <Profile notificationsRef={notificationsRef} />
            </ThemeProvider>
          }
        />
        <Route path="/login" element={<Login notificationsRef={notificationsRef} />} />
        <Route path="/register" element={<Register notificationsRef={notificationsRef} />} />
        <Route path="/forgot-password" element={<ForgetPassword notificationsRef={notificationsRef} />} />
      </Routes>
      <Notifications ref={notificationsRef} />
    </>
  );
}

export default App;