import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './Common/Header';
import Footer from './Common/Footer';
import Sidebar from './Components/Sidebar';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import Category from './Components/Category/Category';
import Item from './Components/Item/Item';
import Bill from './Components/Bill/Bill';
import RestockHistory from './Components/RestockHistory/RestockHistory';
import DistributorData from './Components/DistributorData/DistributorData';
import SalesReport from './Components/SalesReport/SalesReport';
import Customer from './Components/Customer/Customer';
import AddBill from './Components/Bill/AddBill';
import Settings from './Components/Settings';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme();

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isLoginPage = location.pathname === '/';

  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '98vh' }}>
        <Header toggleSidebar={toggleSidebar} showLogout={!isLoginPage} />
        <div style={{ flex: 1, display: 'flex' }}>
          {!isLoginPage && <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} isMinimized={sidebarOpen} />}
          <div style={{ flexGrow: 1, marginTop: '70px' }}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/category" element={<Category />} />
              <Route path="/item" element={<Item />} />
              <Route path="/bill" element={<Bill />} />
              <Route path="/restock-history" element={<RestockHistory />} />
              <Route path="/distributor-data" element={<DistributorData />} />
              <Route path="/sales-report" element={<SalesReport />} />
              <Route path="/customer" element={<Customer />} />
              <Route path="/bill/add-bill" element={<AddBill />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
