import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Avatar, Grid, IconButton } from '@mui/material';
import { PhotoCamera, Delete, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const Profile = ({ notificationsRef }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    user: '',
    avatarUrl: '',
  });
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const messages = {
    userNotLoggedIn: 'User not logged in',
    fetchUserDataError: 'Failed to fetch user data',
    passwordsMismatch: 'Passwords do not match',
    passwordUpdateSuccess: 'Password updated successfully',
    passwordUpdateError: 'Failed to update password',
    avatarUploadSuccess: 'Avatar uploaded successfully',
    avatarUploadError: 'Failed to upload avatar',
    avatarRemoveSuccess: 'Avatar removed successfully',
    avatarRemoveError: 'Failed to remove avatar',
    serverError: 'Error connecting to server',
  };

  useEffect(() => {
    const checkAuthentication = () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        notificationsRef.current.showSnackbar(messages.userNotLoggedIn, 'error');
        navigate('/login');
        return;
      }
      fetchUserData(userId);
    };

    const fetchUserData = async (userId) => {
      try {
        const response = await fetch(`http://localhost:8000/profile.php?user_id=${userId}`);
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          notificationsRef.current.showSnackbar(data.message || messages.fetchUserDataError, 'error');
        }
      } catch (err) {
        notificationsRef.current.showSnackbar(messages.serverError, 'error');
      }
    };

    checkAuthentication();
  }, [navigate, notificationsRef, messages.userNotLoggedIn, messages.fetchUserDataError, messages.serverError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      notificationsRef.current.showSnackbar(messages.passwordsMismatch, 'error');
      setLoading(false);
      return;
    }

    const userId = localStorage.getItem('user_id');
    if (!userId) {
      notificationsRef.current.showSnackbar(messages.userNotLoggedIn, 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/profile.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (data.success) {
        notificationsRef.current.showSnackbar(messages.passwordUpdateSuccess, 'success');
        setFormData({ password: '', confirmPassword: '' });
      } else {
        notificationsRef.current.showSnackbar(data.message || messages.passwordUpdateError, 'error');
      }
    } catch (err) {
      notificationsRef.current.showSnackbar(messages.serverError, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const userId = localStorage.getItem('user_id');
    if (!userId) {
      notificationsRef.current.showSnackbar(messages.userNotLoggedIn, 'error');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('user_id', userId);

    try {
      const response = await fetch('http://localhost:8000/profile.php', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const userResponse = await fetch(`http://localhost:8000/profile.php?user_id=${userId}`);
        const userData = await userResponse.json();
        if (userData.success) {
          setUser(userData.user);
        }
        notificationsRef.current.showSnackbar(messages.avatarUploadSuccess, 'success');
      } else {
        notificationsRef.current.showSnackbar(data.message || messages.avatarUploadError, 'error');
      }
    } catch (err) {
      notificationsRef.current.showSnackbar(messages.serverError, 'error');
    }
  };

  const handleRemove = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      notificationsRef.current.showSnackbar(messages.userNotLoggedIn, 'error');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/profile.php?user_id=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setUser((prev) => ({ ...prev, avatarUrl: '' }));
        notificationsRef.current.showSnackbar(messages.avatarRemoveSuccess, 'info');
      } else {
        notificationsRef.current.showSnackbar(data.message || messages.avatarRemoveError, 'error');
      }
    } catch (err) {
      notificationsRef.current.showSnackbar(messages.serverError, 'error');
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm" className="container">
      <Paper elevation={2} className="paper">
        <IconButton
          onClick={handleBackClick}
          color="primary"
          className="backButton"
        >
          <ArrowBack />
        </IconButton>

        <Typography variant="h5" component="h1" mb={2}>
          Profile
        </Typography>

        <Box component="form" onSubmit={handleSubmit} className="form">
          <Grid container spacing={3}>
            <Grid item xs={12} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
              <Avatar
                className="avatar"
                src={user.avatarUrl}
                alt={user.user}
              >
                {user.user ? user.user[0].toUpperCase() : ''}
              </Avatar>
              <Box className="iconButton">
                <IconButton color="primary" component="label">
                  <input hidden accept="image/*" type="file" onChange={handleUpload} />
                  <PhotoCamera />
                </IconButton>
                <IconButton color="secondary" onClick={handleRemove}>
                  <Delete />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={user.user}
                disabled
                InputLabelProps={{
                  className: 'textFieldLabel',
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;