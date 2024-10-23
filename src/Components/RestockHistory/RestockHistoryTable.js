import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Chip, TableSortLabel } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const RestockHistoryTable = ({ historyData, loading, error, onEdit, onSortToggle, sortOrder }) => {

  const isEmpty = !historyData || historyData.length === 0;

  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mt: 2 }}>
      <Table aria-label="modern history table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Quantity</TableCell>    
            <TableCell>Distributor Name</TableCell>
            <TableCell>Buying Price</TableCell>
            <TableCell>
              Adjustment Date
              <Tooltip title={`Sort by date (${sortOrder === 'ASC' ? 'ASC' : 'DESC'})`}>
                <IconButton onClick={onSortToggle}>
                  {sortOrder === 'ASC' ? <ArrowUpward /> : <ArrowDownward />}
                </IconButton>
              </Tooltip>
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Loading...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                {error}
              </TableCell>
            </TableRow>
          ) : isEmpty ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No data found
              </TableCell>
            </TableRow>            
          ) : (
            historyData.map((data) => (
              <TableRow
                key={data.reStockHistoryId}
                hover
                sx={{
                  backgroundColor: data.Id % 2 === 0 ? 'grey.100' : 'white',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                }}
              >
                <TableCell component="th" scope="row">{data.reStockHistoryId}</TableCell>
                <TableCell>{data.adjustmentType}</TableCell>
                <TableCell>{data.adjustmentQuantity}</TableCell>
                <TableCell>{data.distributorName}</TableCell>
                <TableCell>{data.buyingPrice}</TableCell>
                <TableCell>{new Date(data.adjustmentDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => onEdit(data.reStockHistoryId)} size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="More options">
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
              </TableCell>    
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RestockHistoryTable;
