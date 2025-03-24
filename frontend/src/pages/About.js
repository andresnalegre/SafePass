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
import { Code, Update } from '@mui/icons-material';
import GitHubIcon from '@mui/icons-material/GitHub';
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
        notificationsRef.current.showSnackbar('User not logged', 'error');
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
                <Typography variant="h4" component="h1">
                  About SafePass
                </Typography>
              </Box>

              <Typography variant="body1" paragraph className="aboutSubtitle">
                SafePass  is a platform that helps you create stronger passwords 
                and manage them easily. You can update, delete, and check the strength 
                of your passwords to keep your accounts secure.
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