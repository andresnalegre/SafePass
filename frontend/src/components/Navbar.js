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
import { useTheme } from '../styles/Theme';
import '../styles/styles.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
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

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    sessionStorage.clear();
    navigate('/login', { state: { logoutMessage: 'See you next time!' } });
    handleMenuClose();
  }, [navigate, handleMenuClose]);

  return (
    <AppBar position="fixed" className="navAppBar">
      <Toolbar>
        <Typography variant="h6" className="navDashboardText noSelect">
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