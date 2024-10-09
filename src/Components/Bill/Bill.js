import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Select, MenuItem, FormControlLabel, Switch, TextField, Button, IconButton, Paper } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BillTable from './BillTable';
import { getBills } from '../../Service/Bill.api';
import useProgressBar from '../../Common/ProgressBar';
import { useNavigate } from 'react-router-dom';

export default function Bill() {
  const navigate = useNavigate();
  const { startProgress, stopProgress } = useProgressBar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [bills, setBills] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [returned, setReturned] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('ASC');
  const [DialogOpen, setDialogOpen] = useState(false);

  const filters = useMemo(() => ({
    page,
    size: rowsPerPage,
    paymentMethod,
    paymentStatus,
    startDate,
    endDate,
    returned,
    sortBy,
    sortDirection,
  }), [page, rowsPerPage, paymentMethod, paymentStatus, startDate, endDate, returned, sortBy, sortDirection]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        startProgress();
        setLoading(true);
        const data = await getBills(filters);
        setBills(data.billDetails || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
        stopProgress();
      }
    };

    fetchBills();
  }, [filters]);

  const handleClearFilters = () => {
    setPaymentMethod('');
    setPaymentStatus('');
    setStartDate(null);
    setEndDate(null);
    setReturned(false);
    setSortBy(null);
    setSortDirection('ASC');
    setPage(0);
  };

  const handlePayChange = (newPay) => {
    setPaymentMethod(newPay);
    setPage(0);
  };

  const handleStatusChange = (newStatus) => {
    setPaymentStatus(newStatus);
    setPage(0);
  };

  const handleAddButton = () => {
    startProgress();
    setTimeout(() => {
      navigate('/bill/add-bill');
      stopProgress();
    }, 500);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Bills
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddButton}
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            padding: '8px 16px',
            borderRadius: '8px',
            boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
          }}
        >
          Add Bill
        </Button>
      </Box>

      <Paper elevation={3} sx={{ padding: 2, borderRadius: '8px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate ? startDate.substring(0, 10) : ''}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
              sx={{ borderRadius: '8px' }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate ? endDate.substring(0, 10) : ''}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
              sx={{ borderRadius: '8px' }}
            />
            <FormControlLabel
              control={<Switch checked={returned} onChange={(e) => setReturned(e.target.checked)} />}
              label="Returned"
            />
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<DeleteOutlineIcon />}
              onClick={handleClearFilters}
              sx={{
                textTransform: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                '&:hover': {
                backgroundColor: 'secondary.main',
                color: 'white',
              },
              }}
            >
              Clear Filters
            </Button>
          </Box>
          <IconButton
            color="primary"
            onClick={() => alert('Download data')}
            sx={{
              backgroundColor: 'primary.light',
              borderRadius: '50%',
              boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
            }}
          >
            <FileDownloadIcon />
          </IconButton>
        </Box>
      </Paper>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box>
          <BillTable
            bills={bills}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={(column) => {
              setSortBy(column);
              setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
            }}
            paymentMethod={paymentMethod}
            onPayChange={handlePayChange}
            paymentStatus={paymentStatus}
            onStatusChange={handleStatusChange}
          />
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={bills.length}
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

      {/* <BillDialogBox open={DialogOpen} handleClose={() => setDialogOpen(false)} /> */}
    </Box>
  );
}
