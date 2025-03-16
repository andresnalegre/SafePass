import React from 'react';
import { Container, Typography, Paper, Box, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Info, Security, Code, Update, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const About = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  return (
    <Box className="aboutContainer">
      <IconButton
        onClick={handleBackClick}
        className="aboutBackButton"
        color="primary"
      >
        <ArrowBack />
      </IconButton>

      <Container maxWidth="sm" className="aboutContentContainer">
        <Paper elevation={2} className="aboutPaper">
          <Box className="aboutTitleBox">
            <Info className="aboutInfoIcon" />
            <Typography variant="h5" component="h1">
              About SafePass
            </Typography>
          </Box>

          <Typography variant="body1" paragraph>
            SafePass is an open-source tool that helps you store passwords and create more secure passwords.
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <Security color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Security" 
                secondary="Our project includes encryption features built with React and PHP to ensure your passwords are kept safe."
              />
            </ListItem>

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

          <Box className="aboutFooterBox">
            <Typography variant="body2" color="textSecondary">
              © {new Date().getFullYear()} SafePass. All rights reserved.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default About;