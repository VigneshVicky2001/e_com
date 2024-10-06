import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import BarcodeIcon from '@mui/icons-material/QrCode';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#333',
  // backdropFilter: 'blur(10px)',
  // boxShadow: '0 4px 20px rgba(0, 0, 0, 0)',
  height: '70px',
  zIndex: 1300,
}));

const Header = ({ toggleSidebar, showLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  }

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

        {showLogout && (
          <IconButton onClick={handleLogout} color="inherit" edge="end">
            <LogoutSharpIcon sx={{ fontSize: 30, color: '#fff' }} />
          </IconButton>
        )}
      </Toolbar>
    </GlassAppBar>
  );
};

export default Header;
