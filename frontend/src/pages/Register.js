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
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const Register = ({ notificationsRef }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const errorMessages = {
    usernameRequired: 'Please enter a username',
    passwordRequired: 'Please enter a password',
    confirmPasswordRequired: 'Please confirm your password',
    passwordsMismatch: 'Passwords do not match',
    serverError: 'Error connecting to server',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      notificationsRef.current.showSnackbar(errorMessages.usernameRequired, 'error');
      return;
    }
    if (!password) {
      notificationsRef.current.showSnackbar(errorMessages.passwordRequired, 'error');
      return;
    }
    if (!confirmPassword) {
      notificationsRef.current.showSnackbar(errorMessages.confirmPasswordRequired, 'error');
      return;
    }
    if (password !== confirmPassword) {
      notificationsRef.current.showSnackbar(errorMessages.passwordsMismatch, 'error');
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      const data = await response.json();
      if (data.success) {
        notificationsRef.current.showSnackbar(data.message, 'success');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        notificationsRef.current.showSnackbar(data.message, 'error');
      }
    } catch (err) {
      notificationsRef.current.showSnackbar(errorMessages.serverError, 'error');
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Box className="registerContainer">
      <IconButton
        onClick={() => navigate(-1)}
        className="registerBackButton"
        color="primary"
      >
        <ArrowBack />
      </IconButton>

      <Container component="main" maxWidth="xs" className="registerMainContainer">
        <Fade in={true} timeout={1000}>
          <Paper elevation={3} className="registerPaper">
            <Box className="registerTitleBox">
              <Typography component="h1" variant="h5" className="registerTitle">
                Register
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
                  className: 'registerTextField'
                }}
              />

              <TextField
                required
                fullWidth
                margin="normal"
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  className: 'registerTextField',
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
                  className: 'registerTextField',
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
                className="registerSubmitButton"
              >
                Register
              </Button>
            </form>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;