import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Slider,
  FormControlLabel,
  Checkbox,
  TextField,
  Box,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import { Refresh as GenerateIcon, ContentCopy as CopyIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import PasswordStrength from '../components/PasswordStrength';
import '../styles/styles.css';

const PasswordGenerator = ({ onGenerate }) => {
  const [options, setOptions] = useState({
    length: 16,
    useUppercase: true,
    useNumbers: true,
    useSpecial: true,
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = lowercase;
    let password = '';

    if (options.useUppercase) chars += uppercase;
    if (options.useNumbers) chars += numbers;
    if (options.useSpecial) chars += special;

    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    if (options.useUppercase) password += uppercase[Math.floor(Math.random() * uppercase.length)];
    if (options.useNumbers) password += numbers[Math.floor(Math.random() * numbers.length)];
    if (options.useSpecial) password += special[Math.floor(Math.random() * special.length)];

    while (password.length < options.length) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      password += char;
    }

    return password.split('').sort(() => Math.random() - 0.5).join('').slice(0, options.length);
  };

  const handleGeneratePassword = () => {
    const password = generatePassword();
    setGeneratedPassword(password);
    onGenerate(password);
  };

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      enqueueSnackbar('Password copied to clipboard', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Failed to copy password', { variant: 'error' });
    }
  };

  return (
    <Card className="passwordGenCard">
      <CardContent className="passwordGenCardContent">
        <Typography variant="h6" gutterBottom>Password Generator</Typography>
        <Box className="passwordGenSliderBox">
          <Typography>Length: {options.length}</Typography>
          <Slider
            value={options.length}
            min={8}
            max={32}
            onChange={(_, value) => setOptions({ ...options, length: value })}
            marks={[
              { value: 8, label: '8' },
              { value: 16, label: '16' },
              { value: 24, label: '24' },
              { value: 32, label: '32' },
            ]}
          />
        </Box>

        <Box className="passwordGenCheckboxBox">
          <FormControlLabel
            control={
              <Checkbox
                checked={options.useUppercase}
                onChange={(e) => setOptions({
                  ...options,
                  useUppercase: e.target.checked,
                })}
              />
            }
            label="Uppercase letters"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={options.useNumbers}
                onChange={(e) => setOptions({
                  ...options,
                  useNumbers: e.target.checked,
                })}
              />
            }
            label="Numbers"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={options.useSpecial}
                onChange={(e) => setOptions({
                  ...options,
                  useSpecial: e.target.checked,
                })}
              />
            }
            label="Special characters"
          />
        </Box>

        <Paper variant="outlined" className="passwordGenPaper">
          <TextField
            fullWidth
            value={generatedPassword}
            placeholder="Generated password"
            variant="outlined"
            size="small"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <Box className="passwordGenEndAdornmentBox">
                  <Tooltip title="Copy password">
                    <IconButton onClick={handleCopyPassword} size="small">
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Generate new password">
                    <IconButton onClick={handleGeneratePassword} size="small">
                      <GenerateIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ),
            }}
          />
        </Paper>

        <PasswordStrength password={generatedPassword} />
      </CardContent>
    </Card>
  );
};

export default PasswordGenerator;