import React from 'react';
import { Typography, Box } from '@mui/material';

const Dashboard = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '88vh',
        backgroundImage: 'linear-gradient(to bottom right, #0d47a1, #1b5e20)',
        color: '#fff',
      }}
    >
      <Typography 
        variant="h3"
        sx={{
          marginBottom: 4,
          fontWeight: 'bold',
          letterSpacing: '0.15em',
          color: '#e3f2fd',
          textShadow: '0px 0px 10px rgba(255,255,255,0.5)',
          textAlign: 'center',
        }}
      >
        Hi!
      </Typography>
    </Box>
  );
};

export default Dashboard;
