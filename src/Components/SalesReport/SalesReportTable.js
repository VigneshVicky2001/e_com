import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Chip } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const SalesReportTable = ({ SalesReportData }) => {
//   const renderSortIcon = (column) => {
//     if (sortBy !== column) return null;
//     return sortDirection === 'ASC' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
//   };

  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mt: 2 }}>
      <Table aria-label="modern bill table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell onClick={() => onSort('billingAmount')} style={{ cursor: 'pointer' }}>
              <Tooltip title="Sort by Amount" placement="top">
                <span>Amount {renderSortIcon('billingAmount')}</span>
              </Tooltip>
            </TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell onClick={() => onSort('createdDate')} style={{ cursor: 'pointer' }}>
              <Tooltip title="Sort by Date" placement="top">
                <span>Date {renderSortIcon('createdDate')}</span>
              </Tooltip>
            </TableCell>
            <TableCell onClick={() => onSort('discount')} style={{ cursor: 'pointer' }}>
              <Tooltip title="Sort by Discount" placement="top">
                <span>Discount {renderSortIcon('discount')}</span>
              </Tooltip>
            </TableCell>
            <TableCell>Return</TableCell>
            <TableCell>Payment Status</TableCell>
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
            SalesReportData.map((data) => (
              <TableRow
                key={data.Id}
                hover
                sx={{
                  backgroundColor: data.Id % 2 === 0 ? 'grey.100' : 'white',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                }}
              >
                <TableCell component="th" scope="row">{data.Id}</TableCell>
                <TableCell>{data.customerName}</TableCell>
                <TableCell>{data.billingAmount}</TableCell>
                <TableCell>{data.paymentMethod}</TableCell>
                <TableCell>
                  {new Date(data.createdDate).toLocaleDateString('en-US', {
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
                      bill.paymentStatus === 'Success'
                        ? 'success'
                        : bill.paymentStatus === 'Failure'
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

export default SalesReportTable;
