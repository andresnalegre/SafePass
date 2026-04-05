import React, { useState, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Settings as SettingsIcon, Brightness4, Brightness7, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme as useAppTheme } from '../styles/Theme';
import '../styles/styles.css';

const Navbar = ({ onDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useAppTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

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
    navigate('/', { state: { logoutMessage: 'See you next time!' } });
    handleMenuClose();
  }, [navigate, handleMenuClose]);

  return (
    <AppBar position="fixed" className={isMobile ? 'navAppBarMobile' : 'navAppBar'}>
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onDrawerToggle}
            aria-label="Open menu"
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}
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