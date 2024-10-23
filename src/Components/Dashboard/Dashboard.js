import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import SalesPerMonthChart from './SalesPerMonthChart';
import SalesPerDayChart from './SalesPerDayChart';
import BarChart from './BarChart';

const Dashboard = () => {
  return (
    <Box sx={{ padding: 4, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SalesPerMonthChart />
        </Grid>

        <Grid item xs={12} md={6}>
          <SalesPerDayChart />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <BarChart />
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;
