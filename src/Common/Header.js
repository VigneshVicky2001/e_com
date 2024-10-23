import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { styled } from '@mui/system';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#333',
  height: '70px',
}));

const Header = ({ toggleSidebar, showLogout, logoUrl }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <GlassAppBar position="fixed" className="header">
      <Toolbar sx={{ height: '100%' }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{ marginRight: 2 }}
        >
          <MenuIcon sx={{ fontSize: 40, color: '#fff' }} />
        </IconButton>

        {/* {logoUrl && (
          <Box
            component="img"
            src={logoUrl}
            alt="Organization Logo"
            sx={{
              height: '50px',
              width: 'auto',
              marginRight: '20px',
            }}
          />
        )} */}

        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)',
            fontFamily: 'Poppins, sans-serif',
            flexGrow: 1,
          }}
        >
          Billing Application
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {logoUrl && (
            <IconButton
              sx={{
                borderRadius: '50%',
                padding: 0,
                overflow: 'hidden',
                height: '50px',
                width: '50px',
                marginRight: '16px',
              }}
            >
              <img
                src={logoUrl}
                alt="Store Logo"
                style={{
                  height: '100%',
                  width: '100%',
                }}
              />
            </IconButton>
          )}

          {showLogout && (
            <IconButton onClick={handleLogout} color="inherit" edge="end">
              <LogoutSharpIcon sx={{ fontSize: 30, color: '#fff' }} />
            </IconButton>
          )}
        </Box>

      </Toolbar>
    </GlassAppBar>
  );
};

export default Header;
