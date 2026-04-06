import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Toolbar,
  Link
} from '@mui/material';
import { Update, Storage as StorageIcon, Public as PublicIcon } from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../styles/Theme';
import '../styles/styles.css';

const About = ({ notificationsRef }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { darkMode } = useTheme();

  const primaryColor = darkMode ? '#64b5f6' : '#222222';
  const secondaryColor = darkMode ? '#f0f0f0' : '#777777';
  const subtitleColor = darkMode ? '#f0f0f0' : '#555555';
  const linkColor = darkMode ? '#90caf9' : '#1976d2';
  const iconColor = darkMode ? '#64b5f6' : undefined;

  useEffect(() => {
    const storedUserName = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('user_id');

    if (!storedUserName || !storedUserId) {
      navigate('/');
      return;
    }

    setIsAuthenticated(true);
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!isAuthenticated) return null;

  return (
    <Box className="aboutContainer">
      <Navbar onDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

      <Box className="aboutContentContainer">
        <Toolbar />
        <Paper elevation={3} className="aboutPaper">
          <Box className="aboutTitleBox">
            <Typography className="aboutTitle">
              About SafePass
            </Typography>
          </Box>

          <Typography
            variant="body1"
            className="aboutSubtitle"
            sx={{ color: subtitleColor }}
          >
            SafePass is a platform that helps you create stronger passwords and manage them easily.
          </Typography>

          <List className="aboutList">
            <ListItem className="aboutListItem">
              <ListItemIcon className="aboutListIcon">
                <CodeIcon sx={{ color: iconColor }} color={darkMode ? undefined : 'primary'} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: primaryColor }}>
                    Stack
                  </Typography>
                }
                secondary={
                  <Typography sx={{ fontSize: '0.85rem', color: secondaryColor, mt: '2px' }}>
                    React + Material UI
                  </Typography>
                }
              />
            </ListItem>

            <ListItem className="aboutListItem">
              <ListItemIcon className="aboutListIcon">
                <StorageIcon sx={{ color: iconColor }} color={darkMode ? undefined : 'primary'} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: primaryColor }}>
                    Storage
                  </Typography>
                }
                secondary={
                  <Typography sx={{ fontSize: '0.85rem', color: secondaryColor, mt: '2px' }}>
                    localStorage
                  </Typography>
                }
              />
            </ListItem>

            <ListItem className="aboutListItem">
              <ListItemIcon className="aboutListIcon">
                <PublicIcon sx={{ color: iconColor }} color={darkMode ? undefined : 'primary'} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: primaryColor }}>
                    Deploy
                  </Typography>
                }
                secondary={
                  <Typography sx={{ fontSize: '0.85rem', color: secondaryColor, mt: '2px' }}>
                    Hosted by GitHub Pages
                  </Typography>
                }
              />
            </ListItem>

            <ListItem className="aboutListItem">
              <ListItemIcon className="aboutListIcon">
                <Update sx={{ color: iconColor }} color={darkMode ? undefined : 'primary'} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: primaryColor }}>
                    Version
                  </Typography>
                }
                secondary={
                  <Typography sx={{ fontSize: '0.85rem', color: secondaryColor, mt: '2px' }}>
                    1.0.0
                  </Typography>
                }
              />
            </ListItem>

            <ListItem className="aboutListItem">
              <ListItemIcon className="aboutListIcon">
                <GitHubIcon sx={{ color: iconColor }} color={darkMode ? undefined : 'primary'} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: primaryColor }}>
                    Developed by{' '}
                    <Link
                      href="https://andresnicolas.com/"
                      target="_blank"
                      rel="noopener"
                      sx={{ color: linkColor, textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                    >
                      Andres Nicolas
                    </Link>
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default About;