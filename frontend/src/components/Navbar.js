import React, { useState, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Menu as MenuIcon, Logout, Settings as SettingsIcon, Brightness4, Brightness7 } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../styles/Theme';
import '../styles/styles.css';

const Navbar = ({ onDrawerToggle }) => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

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
    navigate('/');
    handleMenuClose();
  }, [navigate, handleMenuClose]);

  return (
    <AppBar position="fixed" className="navAppBar">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onDrawerToggle}
          className={`navMenuButton ${window.innerWidth < 600 ? 'navMenuButtonVisible' : ''}`}
        >
          <MenuIcon />
        </IconButton>
        <div className="navFlexGrow" />
        <IconButton color="inherit" onClick={toggleDarkMode}>
          {darkMode ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
        <IconButton color="inherit" onClick={handleMenuOpen}>
          <SettingsIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout} startIcon={<Logout />}>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;