import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography, Select, MenuItem, FormControlLabel, Switch, TextField, Button, IconButton, Paper } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { getAllRestockHistory } from '../../Service/Restock.api';
import useProgressBar from '../../Common/ProgressBar';
import RestockHistoryTable from './RestockHistoryTable';
import RHDialogBox from './RHDialogBox';
import CustomSnackbar, { successSnackbar, errorSnackbar } from '../../Common/Snackbar';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function RestockHistory() {
  const { startProgress, stopProgress } = useProgressBar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState(null);
  const [dataCount, setDataCount] = useState(null);
  const [DialogOpen, setDialogOpen] = useState(false);
  const [RHId, setRHId] = useState(null);
  const snackbarRef = useRef(null);

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');
  };

  const fetchData = async () => {
    try{
      startProgress();
      setLoading(true);
      const data = await getAllRestockHistory(sortOrder, startDate, endDate, page, rowsPerPage);
      setHistoryData(data.restockHistories);
      setDataCount(data.length);
      console.log(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      stopProgress();
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, sortOrder]);

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    fetchData();
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setRHId(null);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleEdit = (RHId) => {
    setRHId(RHId);
    setDialogOpen(true);
  };

  const showSuccessSnackbar = (message) => {
    successSnackbar(message, snackbarRef);
  };
  
  const showErrorSnackbar = (message) => {
    errorSnackbar(message, snackbarRef);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Restock History
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
          // sx={{
          //   textTransform: 'none',
          //   fontWeight: 'bold',
          //   padding: '8px 16px',
          //   borderRadius: '8px',
          //   boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
          // }}
        >
          Add History
        </Button>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <DesktopDatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DesktopDatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={handleClearFilters}
              sx={{ height: 'fit-content' }}
            >
              Clear Filters
            </Button>
        </Box>
      </LocalizationProvider>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box>
          <RestockHistoryTable
            historyData={historyData}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onSortToggle={handleSortToggle}
            sortOrder={sortOrder}
          />
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={historyData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Box>
      )}
      <RHDialogBox 
        open={DialogOpen} 
        handleClose={handleCloseDialog} 
        RHId={RHId} 
        onRefresh={handleRefresh}
        showSuccessSnackbar={showSuccessSnackbar}
        showErrorSnackbar={showErrorSnackbar}
      />
      <CustomSnackbar ref={snackbarRef} />
    </Box>
  );
}
