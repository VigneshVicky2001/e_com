import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useProgressBar from '../Common/ProgressBar';

const Menu = () => {
  const { startProgress, stopProgress } = useProgressBar();
  const navigate = useNavigate();

  const handleCategory = () => {
    startProgress();
    setTimeout(() => {
      navigate('/category');
      stopProgress();
    }, 500);
  };

  const handleItem = () => {
    startProgress();
    setTimeout(() => {
      navigate('/item');
      stopProgress();
    }, 500);
  };

  const handleBill = () => {
    startProgress();
    setTimeout(() => {
      navigate('/bill');
      stopProgress();
    }, 500);
  };

  const handleRestockHistory = () => {
    startProgress();
    setTimeout(() => {
      navigate('/restock-history');
      stopProgress();
    }, 500);
  };

  const handleDistributorData = () => {
    startProgress();
    setTimeout(() => {
      navigate('/distributor-data');
      stopProgress();
    }, 500);
  };

  const handleSalesReport = () => {
    startProgress();
    setTimeout(() => {
      navigate('/sales-report');
      stopProgress();
    }, 500);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '87vh',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(to bottom right, #0d47a1, #1b5e20)',
        color: '#fff',
        padding: '10px',
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
        }}>
        MENU
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 0,
          gridTemplateColumns: 'repeat(6, 1fr)',
          width: '90%',
          padding: '0px',
        }}
      >
        {[
          { label: 'Category', onClick: handleCategory, color: '#00b0ff' },
          { label: 'Item', onClick: handleItem, color: '#69f0ae' },
          { label: 'Bill', onClick: handleBill, color: '#ff4081' },
          { label: 'Restock History', onClick: handleRestockHistory, color: '#ffab40' },
          { label: 'Distributor Data', onClick: handleDistributorData, color: '#7c4dff' },
          { label: 'Sales Report', onClick: handleSalesReport, color: '#40c4ff' },
        ].map((item, idx, arr) => (
          <Button
            key={idx}
            variant="contained"
            onClick={item.onClick}
            sx={{
              paddingY: 2,
              width: '100%',
              backgroundColor: item.color,
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: idx === 0 ? '20px 0 0 20px' : idx === arr.length - 1 ? '0 20px 20px 0' : '0px',
              textTransform: 'uppercase',
              boxShadow: `0px 0px 20px ${item.color}, inset 0px -3px 10px rgba(255,255,255,0.1)`,
              transition: 'box-shadow 0.3s ease, transform 0.3s ease',
              '&:hover': {
                backgroundColor: 'transparent',
                transform: 'scale(0.96)',
                boxShadow: `inset 0px 0px 15px rgba(0, 0, 0, 0)`,
                transition: '0.3s ease, transform 0.3s ease',
                background: 'rgba(255, 255, 255, 0.08)',
              },
              '&:active': {
                boxShadow: `inset 0px 0px 15px rgba(0, 0, 0, 1)`,
                transform: 'scale(0.95)',
              },
              textShadow: '0px 0px 12px rgba(255,255,255,0.5)',
            }}
            size="large"
          >
            {item.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default Menu;
