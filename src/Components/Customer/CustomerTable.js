import React, { useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import useProgressBar from '../../Common/ProgressBar';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const CustomerTable = ({ customers, sortBy, sortDirection, onSort }) => {
  const snackbarRef = useRef();

  const renderSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortDirection === 'ASC' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
  };

  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        marginTop: 1,
        maxHeight: '71vh',
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
            backgroundColor: '#e5e5e5',
          },
          '& tbody tr:hover': {
            background: 'rgba(255, 255, 255, 0.08)',
            transition: '0.3s ease',
          },
          '& tbody td': {
            textShadow: '0px 0px 8px rgba(255,255,255,0.3)',
          },
          '& .MuiTableCell-root': {
            padding: '15px 16px',
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center" onClick={() => onSort('name')} style={{ cursor: 'pointer' }}>
              Name {renderSortIcon('name')}
            </TableCell>
            <TableCell align="center">Phone Number</TableCell>
            <TableCell align="center">Address</TableCell>
            <TableCell align="center">E-mail</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.customerId} hover>
              <TableCell align="center">{customer.customerId}</TableCell>
              <TableCell align="center">{customer.customerName}</TableCell>
              <TableCell align="center">{customer.customerPhoneNumber}</TableCell>
              <TableCell align="center">{customer.customerAddress}</TableCell>
              <TableCell align="center">{customer.customerEmail}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <snackbarRef ref={snackbarRef}/>
    </TableContainer>
  );
};

export default CustomerTable;
