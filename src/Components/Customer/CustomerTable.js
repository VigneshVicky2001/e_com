import React, { useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import useProgressBar from '../../Common/ProgressBar';

const CustomerTable = ({ customers }) => {
  const snackbarRef = useRef();
  const { startProgress, stopProgress } = useProgressBar();
  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        marginTop: 1
      }}
    >
      <Table
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
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>E-mail</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.customerId} hover>
              <TableCell>{customer.customerId}</TableCell>
              <TableCell>{customer.customerName}</TableCell>
              <TableCell>{customer.customerPhoneNumber}</TableCell>
              <TableCell>{customer.customerAddress}</TableCell>
              <TableCell>{customer.customerEmail}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <snackbarRef ref={snackbarRef}/>
    </TableContainer>
  );
};

export default CustomerTable;
