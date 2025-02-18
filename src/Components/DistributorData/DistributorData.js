import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography, Select, MenuItem, FormControlLabel, Switch, TextField, Button, IconButton, Paper } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import DistributorDataTable from './DistributorDataTable';
import useProgressBar from '../../Common/ProgressBar';
import { start } from 'nprogress';
import { getAllDistributors } from '../../Service/Distributor.api';
import DistributorDialogBox from './DistributorDialogBox';
import CustomSnackbar, { successSnackbar, errorSnackbar } from '../../Common/Snackbar';

export default function DistributorData() {
  const { startProgress, stopProgress } = useProgressBar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [distributorId, setDistributorId] = useState(null);
  const [distributorData, setDistributorData] = useState(null);
  const [DialogOpen, setDialogOpen] = useState(false);
  const snackbarRef = useRef(null);

  const filters = useMemo(() => ({

  }));

  const fetchData = async () => {
    try{
      startProgress();
      setLoading(true);
      const data = await getAllDistributors();
      setDistributorData(data);
      console.log(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      stopProgress();
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleClearFilters = () => {
    setPage(0);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDistributorId(null);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleEdit = (distributorId) => {
    setDistributorId(distributorId);
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
          Distributor Data
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
          Add Distributor
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box>
          <DistributorDataTable
            distributorData={distributorData}
            onEdit={handleEdit}
          />
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={distributorData.length}
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
      <DistributorDialogBox 
        open={DialogOpen} 
        handleClose={handleCloseDialog} 
        distributorId={distributorId} 
        onRefresh={handleRefresh}
        showSuccessSnackbar={showSuccessSnackbar}
        showErrorSnackbar={showErrorSnackbar}
      />
      <CustomSnackbar ref={snackbarRef} />
    </Box>
  );
}
