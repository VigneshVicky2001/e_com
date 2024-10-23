import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, Chip, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import BillDialog from './BillDialog';

const BillTable = ({ bills, onPayChange, onStatusChange, loading, error, paymentMethod, paymentStatus }) => {
  const [sortBy, setSortBy] = useState('createdDate');
  const [sortDirection, setSortDirection] = useState('DESC');
  const [sortedBills, setSortedBills] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const renderSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortDirection === 'ASC' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
  };

  const handleSort = (column) => {
    const isAsc = sortBy === column && sortDirection === 'ASC';
    setSortBy(column);
    setSortDirection(isAsc ? 'DESC' : 'ASC');
  };

  const handleRowClick = (bill) => {
    setSelectedBill(bill);
    setOpenDialog(true);
  };

  useEffect(() => {
    const sorted = [...bills].sort((a, b) => {
      if (sortBy === 'createdDate') {
        return sortDirection === 'ASC'
          ? new Date(a.createdDate) - new Date(b.createdDate)
          : new Date(b.createdDate) - new Date(a.createdDate);
      }
      if (sortBy === 'billingAmount') {
        return sortDirection === 'ASC' ? a.billingAmount - b.billingAmount : b.billingAmount - a.billingAmount;
      }
      if (sortBy === 'discount') {
        return sortDirection === 'ASC' ? a.discount - b.discount : b.discount - a.discount;
      }
      return 0;
    });
    setSortedBills(sorted);
  }, [bills, sortBy, sortDirection]);

  return (
    <>
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        marginTop: 1,
        maxHeight: 800,
        overflowY: 'auto',
      }}
    >
      <Table
        stickyHeader
        aria-label="custom category table"
        sx={{
          '& thead th': {
            fontWeight: 'bold',
            background: 'rgba(0, 0, 0, 0.1)',
          },
          '& tbody tr:hover': {
            background: 'rgba(255, 255, 255, 0.08)',
            transition: '0.3s ease',
          },
          '& tbody td': {
            textShadow: '0px 0px 8px rgba(255,255,255,0.3)',
          },
          '& .MuiTableCell-root': {
            padding: '8px 16px',
          },
        }}
      >
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 50 }}>ID</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Customer Name</TableCell>
              <TableCell sx={{ minWidth: 100 }} onClick={() => handleSort('billingAmount')} style={{ cursor: 'pointer' }}>
                <Tooltip title="Sort by Amount" placement="top">
                  <span>Amount {renderSortIcon('billingAmount')}</span>
                </Tooltip>
              </TableCell>
              <TableCell sx={{ minWidth: 150 }}>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 145 }}>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={paymentMethod}
                    onChange={(e) => onPayChange(e.target.value)}
                    label="Payment Method"
                  >
                    <MenuItem value=""><em>All</em></MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="credit">Credit</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell sx={{ minWidth: 150 }} onClick={() => handleSort('createdDate')} style={{ cursor: 'pointer' }}>
                <Tooltip title="Sort by Date" placement="top">
                  <span>Date {renderSortIcon('createdDate')}</span>
                </Tooltip>
              </TableCell>
              <TableCell sx={{ minWidth: 100 }} onClick={() => handleSort('discount')} style={{ cursor: 'pointer' }}>
                <Tooltip title="Sort by Discount" placement="top">
                  <span>Discount {renderSortIcon('discount')}</span>
                </Tooltip>
              </TableCell>
              <TableCell sx={{ minWidth: 100 }}>Return</TableCell>
              <TableCell sx={{ minWidth: 150 }}>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 137 }}>
                  <InputLabel>Payment Status</InputLabel>
                  <Select
                    value={paymentStatus}
                    onChange={(e) => onStatusChange(e.target.value)}
                    label="Payment Status"
                  >
                    <MenuItem value=""><em>All</em></MenuItem>
                    <MenuItem value="success">Success</MenuItem>
                    <MenuItem value="failure">Failure</MenuItem>
                    <MenuItem value="due">Due</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {error}
                </TableCell>
              </TableRow>
            ) : sortedBills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="h6" color="textSecondary">
                    No records found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedBills.map((bill) => (
                <TableRow
                  key={bill.Id}
                  hover
                  sx={{
                    backgroundColor: bill.Id % 2 === 0 ? 'grey.100' : 'white',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                    cursor: 'pointer',
                  }}
                  onClick={() => handleRowClick(bill)}
                >
                  <TableCell>{bill.Id}</TableCell>
                  <TableCell>{bill.customerName}</TableCell>
                  <TableCell>{bill.billingAmount}</TableCell>
                  <TableCell>{bill.paymentMethod}</TableCell>
                  <TableCell>
                    {new Date(bill.createdDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>{bill.discount}</TableCell>
                  <TableCell>{bill.returned ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <Chip
                      label={bill.paymentStatus}
                      color={
                        bill.paymentStatus === 'success'
                          ? 'success'
                          : bill.paymentStatus === 'failure'
                          ? 'error'
                          : 'warning'
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <BillDialog open={openDialog} onClose={() => setOpenDialog(false)} bill={selectedBill} />
    </>
  );
};

export default BillTable;
