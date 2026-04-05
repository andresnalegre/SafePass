import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Toolbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ContentCopy as CopyIcon,
  Search as SearchIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PasswordGenerator from '../components/PasswordGenerator';
import PasswordStrength from '../components/PasswordStrength';
import '../styles/styles.css';

const PASSWORDS_KEY = 'safepass_passwords';

const Dashboard = ({ notificationsRef }) => {
  const [passwords, setPasswords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState({ title: '', username: '', password: '' });
  const [editingPassword, setEditingPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const messages = {
    copyPasswordSuccess: 'Password copied to clipboard.',
    copyPasswordError: 'Failed to copy password.',
    deletePasswordSuccess: 'Password deleted successfully.',
    savePasswordSuccess: 'Password saved successfully.',
    allFieldsRequired: 'All fields are required.',
  };

  useEffect(() => {
    const storedUserName = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('user_id');

    if (!storedUserName || !storedUserId) {
      navigate('/');
      return;
    }

    setIsAuthenticated(true);
    setUserName(storedUserName);

    const allPasswords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || '[]');
    const userPasswords = allPasswords.filter((p) => p.created_by === storedUserName);
    setPasswords(userPasswords);
  }, [navigate]);

  const savePasswordsToStorage = (updatedPasswords, currentUser) => {
    const allPasswords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || '[]');
    const otherPasswords = allPasswords.filter((p) => p.created_by !== currentUser);
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify([...otherPasswords, ...updatedPasswords]));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCopyPassword = async (password) => {
    try {
      await navigator.clipboard.writeText(password);
      notificationsRef.current.showSnackbar(messages.copyPasswordSuccess, 'success');
    } catch (err) {
      notificationsRef.current.showSnackbar(messages.copyPasswordError, 'error');
    }
  };

  const togglePasswordVisibility = (passwordId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [passwordId]: !prev[passwordId],
    }));
  };

  const handleDeletePassword = (passwordId) => {
    const updated = passwords.filter((p) => p.id !== passwordId);
    setPasswords(updated);
    savePasswordsToStorage(updated, userName);
    notificationsRef.current.showSnackbar(messages.deletePasswordSuccess, 'success');
  };

  const handleAddPassword = () => {
    setNewPassword({ title: '', username: '', password: '' });
    setEditingPassword(null);
    setDialogOpen(true);
    setIsSaveEnabled(false);
  };

  const handleEditPassword = (password) => {
    setNewPassword(password);
    setEditingPassword(password);
    setDialogOpen(true);
    setIsSaveEnabled(false);
  };

  const handleSavePassword = () => {
    if (!newPassword.title || !newPassword.username || !newPassword.password) {
      notificationsRef.current.showSnackbar(messages.allFieldsRequired, 'warning');
      return;
    }

    let updated;
    if (editingPassword) {
      updated = passwords.map((p) =>
        p.id === editingPassword.id ? { ...newPassword, id: p.id, created_by: userName } : p
      );
    } else {
      const newEntry = {
        ...newPassword,
        id: Date.now().toString(),
        created_by: userName,
      };
      updated = [...passwords, newEntry];
    }

    setPasswords(updated);
    savePasswordsToStorage(updated, userName);
    notificationsRef.current.showSnackbar(messages.savePasswordSuccess, 'success');
    setDialogOpen(false);
    setEditingPassword(null);
    setIsSaveEnabled(false);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (field, value) => {
    setNewPassword((prev) => ({ ...prev, [field]: value }));
    setIsSaveEnabled(true);
  };

  const filteredPasswords = passwords.filter((password) =>
    (password.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (password.username?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) return null;

  return (
    <Box className="dashContainer">
      <Navbar onDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      <Container component="main" maxWidth="xl" className="dashMain">
        <Toolbar />
        <Box className="dashHeader">
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={handleAddPassword}
          >
            Add Password
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box className="passHeader">
                  <Typography variant="h5">
                    Passwords
                    <Chip label={filteredPasswords.length} size="small" className="passCount" />
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Search passwords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="searchField"
                    InputProps={{
                      startAdornment: <SearchIcon color="action" className="searchIcon" />,
                    }}
                  />
                </Box>

                {filteredPasswords.length === 0 ? (
                  <Typography variant="h6" color="textSecondary" align="center">
                    No passwords found
                  </Typography>
                ) : (
                  filteredPasswords.map((password) => (
                    <Card key={password.id} className="passCard">
                      <CardContent>
                        <Box className="passDetails">
                          <Box>
                            <Typography variant="h6" className="passwordTitle">
                              {password.title}
                            </Typography>
                            <Typography className="passwordUsername">
                              {password.username}
                            </Typography>
                          </Box>
                          <Box className="passActions">
                            <Tooltip title={visiblePasswords[password.id] ? 'Hide Password' : 'Show Password'}>
                              <IconButton onClick={() => togglePasswordVisibility(password.id)} size="small">
                                {visiblePasswords[password.id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton onClick={() => handleEditPassword(password)} size="small">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Copy Password">
                              <IconButton onClick={() => handleCopyPassword(password.password)} size="small">
                                <CopyIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton onClick={() => handleDeletePassword(password.id)} size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                        {visiblePasswords[password.id] && (
                          <Typography variant="body2" className="passText">
                            {password.password}
                          </Typography>
                        )}
                        <PasswordStrength password={password.password} />
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <PasswordGenerator
              onGenerate={(password) => setNewPassword((prev) => ({ ...prev, password }))}
              notificationsRef={notificationsRef}
            />
          </Grid>
        </Grid>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>{editingPassword ? 'Edit' : 'Add New Password'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              value={newPassword.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            <TextField
              margin="dense"
              label="Username"
              type="text"
              fullWidth
              value={newPassword.username}
              onChange={(e) => handleChange('username', e.target.value)}
            />
            <TextField
              margin="dense"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={newPassword.password}
              onChange={(e) => handleChange('password', e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={toggleShowPassword} size="small">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
            <PasswordStrength password={newPassword.password} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSavePassword} color="primary" disabled={!isSaveEnabled}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Dashboard;