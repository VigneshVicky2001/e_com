import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HistoryIcon from '@mui/icons-material/History';
import BusinessIcon from '@mui/icons-material/Business';
import ReportIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const Sidebar = ({ open, isMinimized }) => {
  const drawerWidth = isMinimized ? 70 : 240;
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToPage = (path) => {
    navigate(path);
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Category', path: '/category', icon: <CategoryIcon /> },
    { label: 'Item', path: '/item', icon: <InventoryIcon /> },
    { label: 'Bill', path: '/bill', icon: <ReceiptIcon /> },
    { label: 'Restock History', path: '/restock-history', icon: <HistoryIcon /> },
    { label: 'Distributor Data', path: '/distributor-data', icon: <BusinessIcon /> },
    // { label: 'Sales Report', path: '/sales-report', icon: <ReportIcon /> },
    { label: 'Customer', path: '/customer', icon: <PeopleAltIcon /> },
    { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          backgroundColor: '#333',
          color: '#fff',
          paddingTop: '10px',
          position: 'fixed',
          top: '70px',
          bottom: '50px',
          transition: 'width 0.3s ease',
        },
      }}
      open={open}
    >
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => navigateToPage(item.path)}
            sx={{
              justifyContent: isMinimized ? 'center' : 'initial',
              px: isMinimized ? 1 : 2,
              py: 2,
              backgroundColor: location.pathname === item.path ? '#444' : 'transparent', // Highlight active item
              '&:hover': {
                backgroundColor: '#555',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isMinimized ? 0 : 2,
                justifyContent: 'center',
                color: location.pathname === item.path ? '#4caf50' : '#fff', // Highlight icon
                transition: 'margin 0.3s ease',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!isMinimized && (
              <ListItemText
                primary={item.label}
                sx={{
                  color: location.pathname === item.path ? '#4caf50' : '#fff', // Highlight text
                  opacity: isMinimized ? 0 : 1,
                  transition: 'opacity 0.3s ease, margin 0.3s ease',
                  marginLeft: isMinimized ? '0px' : '10px',
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
