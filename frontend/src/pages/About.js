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
  Grid
} from '@mui/material';
import { Info, Code, Update } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/styles.css';

const About = ({ notificationsRef }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      const storedUserName = localStorage.getItem('username');
      
      if (!storedUserName) {
        notificationsRef.current.showSnackbar('User not logged in', 'error');
        navigate('/login');
      }
    };

    checkAuthentication();
  }, [navigate, notificationsRef]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
            <Paper 
              elevation={4} 
              className="aboutPaper"
            >
              <Box className="aboutTitleBox">
                <Info className="aboutInfoIcon" />
                <Typography variant="h4" component="h1">
                  About SafePass
                </Typography>
              </Box>

              <Typography variant="body1" paragraph>
                SafePass is a platform that allows you to store passwords and create secure passwords.
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <Code color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="IT Career Switch Project" 
                    secondary="Final Project"
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
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;