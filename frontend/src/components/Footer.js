import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import '../styles/styles.css';

function Footer() {
  return (
    <Box
      component="footer"
      className="footer"
      sx={{
        backgroundColor: (theme) => 
          theme.palette.mode === 'light' 
            ? theme.palette.grey[200] 
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="body2" className="footerText">
          {'Copyright © SafePass '}
          {new Date().getFullYear()}
          {'. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;