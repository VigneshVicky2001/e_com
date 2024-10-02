import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Select, MenuItem, FormControlLabel, Switch, TextField, Button, IconButton, Paper } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { getAllRestockHistory } from '../../Service/RestockApi';
import useProgressBar from '../../Common/ProgressBar';
import RestockHistoryTable from './RestockHistoryTable';
import RHDialogBox from './RHDialogBox';

export default function RestockHistory() {
  const { startProgress, stopProgress } = useProgressBar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState(null);
  const [DialogOpen, setDialogOpen] = useState(false);
  const [RHId, setRHId] = useState(null);

  const filters = useMemo(() => ({

  }));

  const fetchData = async () => {
    try{
      startProgress();
      setLoading(true);
      const data = await getAllRestockHistory();
      setHistoryData(data);
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
  }, []);

  const handleClearFilters = () => {
    
    setPage(0);
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
  }

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

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box>
          <RestockHistoryTable
            historyData={historyData}
            onEdit={handleEdit}
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
      <RHDialogBox open={DialogOpen} handleClose={handleCloseDialog} RHId={RHId} onRefresh={handleRefresh}/>
    </Box>
  );
}
