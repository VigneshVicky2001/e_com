import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, Chip, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const BillTable = ({ bills, sortBy, sortDirection, onSort, loading, error, paymentMethod, paymentStatus, onPayChange, onStatusChange }) => {
  const renderSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortDirection === 'ASC' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
  };

  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mt: 2, maxHeight: 487, overflow: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: 50 }}>ID</TableCell>
            <TableCell sx={{ minWidth: 150 }}>Customer Name</TableCell>
            <TableCell sx={{ minWidth: 100 }} onClick={() => onSort('billingAmount')} style={{ cursor: 'pointer' }}>
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
            <TableCell sx={{ minWidth: 150 }} onClick={() => onSort('createdDate')} style={{ cursor: 'pointer' }}>
              <Tooltip title="Sort by Date" placement="top">
                <span>Date {renderSortIcon('createdDate')}</span>
              </Tooltip>
            </TableCell>
            <TableCell sx={{ minWidth: 100 }} onClick={() => onSort('discount')} style={{ cursor: 'pointer' }}>
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
          ) : (
            bills.map((bill) => (
              <TableRow
                key={bill.Id}
                hover
                sx={{
                  backgroundColor: bill.Id % 2 === 0 ? 'grey.100' : 'white',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                }}
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
  );
};

export default BillTable;
