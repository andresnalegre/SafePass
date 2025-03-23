import React, { useState, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { Settings as SettingsIcon, Brightness4, Brightness7 } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useTheme } from '../styles/Theme';
import '../styles/styles.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState(null);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/about':
        return 'About';
      default:
        return '';
    }
  };

  const handleMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleProfile = useCallback(() => {
    navigate('/profile');
    handleMenuClose();
  }, [navigate, handleMenuClose]);

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/logout.php', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        sessionStorage.clear();
        enqueueSnackbar(data.message, { variant: 'success' });
        navigate('/login', { state: { logoutMessage: data.message } });
      } else {
        enqueueSnackbar('Failed to log out. Please try again.', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error logging out:', error);
      enqueueSnackbar('Error logging out. Please try again.', { variant: 'error' });
    }
    handleMenuClose();
  }, [navigate, handleMenuClose, enqueueSnackbar]);

  return (
    <AppBar position="fixed" className="navAppBar">
      <Toolbar>
        <Typography
          variant="h6"
          className="navDashboardText noSelect"
        >
          {getPageTitle()}
        </Typography>
        <div className="navFlexGrow" />
        <IconButton color="inherit" onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {darkMode ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
        <IconButton color="inherit" onClick={handleMenuOpen} aria-label="Open settings menu">
          <SettingsIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;