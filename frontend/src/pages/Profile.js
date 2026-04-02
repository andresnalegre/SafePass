import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Avatar, Grid, IconButton } from '@mui/material';
import { PhotoCamera, Delete, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const Profile = ({ notificationsRef }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ username: '', avatarUrl: '' });
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });

  const messages = {
    userNotLoggedIn: 'User not logged.',
    passwordsMismatch: 'Passwords do not match.',
    passwordUpdateSuccess: 'Password updated successfully.',
    avatarUploadSuccess: 'Avatar uploaded successfully.',
    avatarRemoveSuccess: 'Avatar removed successfully.',
  };

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const username = localStorage.getItem('username');

    if (!userId) {
      notificationsRef.current.showSnackbar(messages.userNotLoggedIn, 'error');
      navigate('/login');
      return;
    }

    const users = JSON.parse(localStorage.getItem('safepass_users') || '[]');
    const found = users.find((u) => u.id === userId);
    if (found) {
      setUser({ username: found.username, avatarUrl: found.avatarUrl || '' });
    }
  }, [navigate, notificationsRef]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    const users = JSON.parse(localStorage.getItem('safepass_users') || '[]');
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
      users[userIndex].password = btoa(formData.password);
      localStorage.setItem('safepass_users', JSON.stringify(users));
    }

    notificationsRef.current.showSnackbar(messages.passwordUpdateSuccess, 'success');
    setFormData({ password: '', confirmPassword: '' });
    setLoading(false);
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const avatarUrl = reader.result;
      const userId = localStorage.getItem('user_id');
      const users = JSON.parse(localStorage.getItem('safepass_users') || '[]');
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex !== -1) {
        users[userIndex].avatarUrl = avatarUrl;
        localStorage.setItem('safepass_users', JSON.stringify(users));
        setUser((prev) => ({ ...prev, avatarUrl }));
      }

      notificationsRef.current.showSnackbar(messages.avatarUploadSuccess, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    const userId = localStorage.getItem('user_id');
    const users = JSON.parse(localStorage.getItem('safepass_users') || '[]');
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
      users[userIndex].avatarUrl = '';
      localStorage.setItem('safepass_users', JSON.stringify(users));
      setUser((prev) => ({ ...prev, avatarUrl: '' }));
    }

    notificationsRef.current.showSnackbar(messages.avatarRemoveSuccess, 'success');
  };

  return (
    <Container maxWidth="sm" className="container">
      <Paper elevation={2} className="paper">
        <IconButton
          onClick={() => navigate('/')}
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
                sx={{ width: 100, height: 100 }}
                src={user.avatarUrl}
                alt={user.username}
              >
                {user.username ? user.username[0].toUpperCase() : ''}
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
                value={user.username}
                disabled
                InputLabelProps={{ className: 'textFieldLabel' }}
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
              <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? 'Updating...' : 'Save'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;