import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Fade
} from '@mui/material';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const ForgotPassword = ({ notificationsRef }) => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      notificationsRef.current.showSnackbar('Please enter a username', 'error');
      return;
    }

    if (!newPassword) {
      notificationsRef.current.showSnackbar('Please enter a new password', 'error');
      return;
    }

    if (!confirmPassword) {
      notificationsRef.current.showSnackbar('Please confirm your password', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      notificationsRef.current.showSnackbar('Passwords do not match', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/forgetpassword.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          newPassword,
        }),
      });

      const data = await response.json();
      if (data.success) {
        notificationsRef.current.showSnackbar(data.message, 'success');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        notificationsRef.current.showSnackbar(data.message, 'error');
      }
    } catch (err) {
      notificationsRef.current.showSnackbar('Error connecting to server', 'error');
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Box className="resetContainer">
      <IconButton
        onClick={() => navigate(-1)}
        className="resetBackButton"
        color="primary"
      >
        <ArrowBack />
      </IconButton>

      <Container component="main" maxWidth="xs" className="resetMainContainer">
        <Fade in={true} timeout={1000}>
          <Paper elevation={3} className="resetPaper">
            <Box className="resetTitleBox">
              <Typography component="h1" variant="h5" className="resetTitle">
                Reset Password
              </Typography>
            </Box>

            <form onSubmit={handleSubmit} noValidate>
              <TextField
                required
                fullWidth
                margin="normal"
                id="username"
                name="username"
                label="Username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  className: 'resetTextField'
                }}
              />

              <TextField
                required
                fullWidth
                margin="normal"
                id="newPassword"
                name="newPassword"
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  className: 'resetTextField',
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                required
                fullWidth
                margin="normal"
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  className: 'resetTextField',
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="resetSubmitButton"
              >
                Reset Password
              </Button>
            </form>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default ForgotPassword;