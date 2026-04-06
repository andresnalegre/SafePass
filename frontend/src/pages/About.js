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

  const primaryColor = darkMode ? '#ffffff' : '#222222';
  const secondaryColor = darkMode ? '#e0e0e0' : '#777777';
  const subtitleColor = darkMode ? '#e0e0e0' : '#555555';
  const linkColor = darkMode ? '#90caf9' : '#1976d2';
  const iconColor = darkMode ? '#64b5f6' : '#1976d2';

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

  const listItems = [
    { icon: <CodeIcon style={{ color: iconColor }} />, primary: 'Stack', secondary: 'React + Material UI' },
    { icon: <StorageIcon style={{ color: iconColor }} />, primary: 'Storage', secondary: 'localStorage' },
    { icon: <PublicIcon style={{ color: iconColor }} />, primary: 'Deploy', secondary: 'Hosted by GitHub Pages' },
    { icon: <Update style={{ color: iconColor }} />, primary: 'Version', secondary: '1.0.0' },
  ];

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
            style={{ color: subtitleColor }}
          >
            SafePass is a platform that helps you create stronger passwords and manage them easily.
          </Typography>

          <List className="aboutList">
            {listItems.map((item, index) => (
              <ListItem key={index} className="aboutListItem">
                <ListItemIcon className="aboutListIcon">
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: primaryColor }}>
                      {item.primary}
                    </span>
                  }
                  secondary={
                    <span style={{ fontSize: '0.85rem', color: secondaryColor, marginTop: '2px', display: 'block' }}>
                      {item.secondary}
                    </span>
                  }
                />
              </ListItem>
            ))}

            <ListItem className="aboutListItem">
              <ListItemIcon className="aboutListIcon">
                <GitHubIcon style={{ color: iconColor }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: primaryColor }}>
                    Developed by{' '}
                    <Link
                      href="https://andresnicolas.com/"
                      target="_blank"
                      rel="noopener"
                      style={{ color: linkColor, textDecoration: 'none', fontWeight: 600 }}
                    >
                      Andres Nicolas
                    </Link>
                  </span>
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