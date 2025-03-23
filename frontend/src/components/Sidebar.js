import React, { useMemo } from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Dashboard,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import SafePassImage from '../assets/SafePass.png';
import '../styles/styles.css';

const MENU_ITEMS = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'About', icon: <InfoIcon />, path: '/about' },
];

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const drawer = useMemo(() => (
    <Box>
      <Toolbar className="sidebarToolbar">
        <img 
          src={SafePassImage} 
          alt="SafePass"
          className="sidebarLogo"
          draggable="false"
        />
      </Toolbar>
      <Divider />
      <List>
        {MENU_ITEMS.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  ), [location.pathname, navigate]);

  return (
    <Box component="nav" className="sidebarNav">
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        classes={{ paper: 'sidebarDrawerPaper' }}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        classes={{ paper: 'sidebarDrawerPaper' }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;