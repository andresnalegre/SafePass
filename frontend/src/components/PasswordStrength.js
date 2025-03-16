import React from 'react';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';

export const getPasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      level: 'Very Weak',
      message: '',
      color: '#ff0000',
      requirements: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false,
      },
    };
  }

  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  let score = 0;

  if (requirements.minLength) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  if (requirements.hasUppercase) score += 15;
  if (requirements.hasLowercase) score += 15;
  if (requirements.hasNumber) score += 15;
  if (requirements.hasSpecial) score += 15;

  score = Math.min(100, score);

  let level, color, message;
  if (score >= 80) {
    level = 'Very Strong';
    color = '#2e7d32';
    message = 'Excellent!';
  } else if (score >= 60) {
    level = 'Strong';
    color = '#4caf50';
    message = 'Good';
  } else if (score >= 40) {
    level = 'Moderate';
    color = '#ff9800';
    message = 'Could be stronger';
  } else if (score >= 20) {
    level = 'Weak';
    color = '#f44336';
    message = 'Too weak';
  } else {
    level = 'Very Weak';
    color = '#d32f2f';
    message = 'Not secure';
  }

  return { score, level, message, color, requirements };
};

const PasswordStrength = ({ password }) => {
  const { score, message, color, requirements } = getPasswordStrength(password);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" sx={{ color, fontWeight: 'bold' }}>
        {message}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={score}
        sx={{
          height: 8,
          borderRadius: 1,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
          },
        }}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        <Chip label="8+ characters" color={requirements.minLength ? 'success' : 'default'} />
        <Chip label="Uppercase" color={requirements.hasUppercase ? 'success' : 'default'} />
        <Chip label="Lowercase" color={requirements.hasLowercase ? 'success' : 'default'} />
        <Chip label="Number" color={requirements.hasNumber ? 'success' : 'default'} />
        <Chip label="Special char" color={requirements.hasSpecial ? 'success' : 'default'} />
      </Box>
    </Box>
  );
};

export default PasswordStrength;