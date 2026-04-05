import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Toolbar,
  Grid,
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
      
      <Container component="main" maxWidth="lg" className="aboutContentContainer">
        <Toolbar />
        
        <Grid 
          container 
          justifyContent="center" 
          alignItems="center" 
          className="aboutContentContainer"
        >
          <Grid item xs={12} sm={10} md={8} lg={8}>
            <Paper elevation={4} className="aboutPaper">
              <Box className="aboutTitleBox">
                <Typography variant="h4" component="h1">
                  About SafePass
                </Typography>
              </Box>

              <Typography variant="body1" paragraph className="aboutSubtitle">
                SafePass is a platform that helps you create stronger passwords and manage them easily.
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <CodeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Stack" 
                    secondary="React + Material UI"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <StorageIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Storage" 
                    secondary="localStorage"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <PublicIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Deploy" 
                    secondary="Hosted by GitHub Pages"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Update color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Version" 
                    secondary="1.0.0"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <GitHubIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <>
                        Developed by{' '}
                        <Link href="https://github.com/andresnalegre" target="_blank" rel="noopener">
                          Andres Nicolas
                        </Link>
                      </>
                    }
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;