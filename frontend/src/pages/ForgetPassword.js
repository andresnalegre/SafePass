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

  const errorMessages = {
    usernameRequired: 'Enter your username.',
    newPasswordRequired: 'Enter a new password.',
    confirmPasswordRequired: 'Confirm your password.',
    passwordsMismatch: "Passwords don't match.",
    userNotFound: 'Username not found.',
    passwordUpdated: 'Password updated!',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      notificationsRef.current.showSnackbar(errorMessages.usernameRequired, 'error');
      return;
    }
    if (!newPassword) {
      notificationsRef.current.showSnackbar(errorMessages.newPasswordRequired, 'error');
      return;
    }
    if (!confirmPassword) {
      notificationsRef.current.showSnackbar(errorMessages.confirmPasswordRequired, 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      notificationsRef.current.showSnackbar(errorMessages.passwordsMismatch, 'error');
      return;
    }

    const users = JSON.parse(localStorage.getItem('safepass_users') || '[]');
    const userIndex = users.findIndex((u) => u.username === username);

    if (userIndex === -1) {
      notificationsRef.current.showSnackbar(errorMessages.userNotFound, 'error');
      return;
    }

    users[userIndex].password = btoa(newPassword);
    localStorage.setItem('safepass_users', JSON.stringify(users));

    notificationsRef.current.showSnackbar(errorMessages.passwordUpdated, 'success');
    setTimeout(() => navigate('/login'), 2000);
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
                InputProps={{ className: 'resetTextField' }}
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