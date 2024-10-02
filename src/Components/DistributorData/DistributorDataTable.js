import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const DistributorDataTable = ({ distributorData, loading, error, onEdit }) => {
  const isEmpty = !distributorData || distributorData.length === 0;

  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mt: 2 }}>
      <Table aria-label="modern table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Address</TableCell>
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
            distributorData.map((data) => (
              <TableRow
                key={data.id}
                hover
                sx={{
                  backgroundColor: data.id % 2 === 0 ? 'grey.100' : 'white',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                }}
              >
                <TableCell component="th" scope="row">{data.id}</TableCell>
                <TableCell>{data.name}</TableCell>
                <TableCell>{data.contactInfo}</TableCell>
                <TableCell>{data.address}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => onEdit(data.id)} size="small" color="primary">
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

export default DistributorDataTable;
