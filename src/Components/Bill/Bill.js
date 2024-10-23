import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, FormControlLabel, Switch, Button, IconButton, Paper } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BillTable from './BillTable';
import { getBills } from '../../Service/Bill.api';
import useProgressBar from '../../Common/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';

export default function Bill() {
  const navigate = useNavigate();
  const { startProgress, stopProgress } = useProgressBar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [bills, setBills] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalBills, setTotalBills] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [returned, setReturned] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('ASC');

  const formatToUTC = (date) => {
    if (!date) return null;
    const dateInIST = new Date(date);
    const utcDate = new Date(dateInIST.getTime() - (5.5 * 60 * 60 * 1000));
    return utcDate.toISOString();
  };

  const filters = useMemo(() => {
    return {
      page,
      size: rowsPerPage,
      paymentMethod,
      paymentStatus,
      startDate: formatToUTC(startDate),
      endDate: formatToUTC(endDate),
      returned,
      sortBy,
      sortDirection,
    };
  }, [page, rowsPerPage, paymentMethod, paymentStatus, startDate, endDate, returned, sortBy, sortDirection]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        startProgress();
        setLoading(true);
        const data = await getBills(filters);
        setBills(data.billDetails || []);
        setTotalBills(data.count || 0);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                  sx: {
                    width: '175px', // Set the width for the field
                    '& .MuiOutlinedInput-root': {
                      padding: '4px', // Smaller padding
                      fontSize: '12px', // Smaller font size
                      height: '40px', // Control overall height
                    },
                    '& .MuiInputBase-input': {
                      padding: '6px', // Adjust padding within the input field
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="End Date"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                  sx: {
                    width: '175px',
                    '& .MuiOutlinedInput-root': {
                      padding: '4px',
                      fontSize: '12px',
                      height: '40px',
                    },
                    '& .MuiInputBase-input': {
                      padding: '6px',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>

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
            // rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={totalBills}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}
    </Box>
  );
}
