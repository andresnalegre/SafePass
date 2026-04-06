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
import '../styles/styles.css';

const About = ({ notificationsRef }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

          <Typography variant="body1" className="aboutSubtitle">
            SafePass is a platform that helps you create stronger passwords and manage them easily.
          </Typography>

          <List className="aboutList">
            <ListItem className="aboutListItem">
              <ListItemIcon className="aboutListIcon">
                <CodeIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography className="aboutItemPrimary">Stack</Typography>}
                secondary={<Typography className="aboutItemSecondary">React + Material UI</Typography>}
              />
            </ListItem>

            <ListItem className="aboutListItem">
              <ListItemIcon className="aboutListIcon">
                <StorageIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography className="aboutItemPrimary">Storage</Typography>}
                secondary={<Typography className="aboutItemSecondary">localStorage</Typography>}
              />
            </ListItem>

            <ListItem className="aboutListItem">
              <ListItemIcon className="aboutListIcon">
                <PublicIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography className="aboutItemPrimary">Deploy</Typography>}
                secondary={<Typography className="aboutItemSecondary">Hosted by GitHub Pages</Typography>}
              />
            </ListItem>

            <ListItem className="aboutListItem">
              <ListItemIcon className="aboutListIcon">
                <Update color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography className="aboutItemPrimary">Version</Typography>}
                secondary={<Typography className="aboutItemSecondary">1.0.0</Typography>}
              />
            </ListItem>

            <ListItem className="aboutListItem">
              <ListItemIcon className="aboutListIcon">
                <GitHubIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography className="aboutItemPrimary">
                    Developed by{' '}
                    <Link href="https://andresnicolas.com/" target="_blank" rel="noopener" className="aboutLink">
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