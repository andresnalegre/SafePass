import React, { createContext, useState, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = React.useMemo(() => {
    return createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        background: {
          default: darkMode ? '#4e4e4e' : '#ffffff',
          paper: darkMode ? '#4e4e4e' : '#ffffff',
        },
        text: {
          primary: darkMode ? '#f5f5f5' : '#000000',
          secondary: darkMode ? '#cfcfcf' : '#666666',
        },
      },
    });
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    document.body.classList.toggle('light-mode', !darkMode);
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};