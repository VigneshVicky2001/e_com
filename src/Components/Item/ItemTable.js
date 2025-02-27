import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Chip } from '@mui/material';
import { ArrowUpward, ArrowDownward, Edit, Visibility } from '@mui/icons-material';
import { FormControl, Select, InputLabel } from '@mui/material';
import { MenuItem } from '@mui/material';

const ItemTable = ({ items, onEdit, onView, sortBy, sortDirection, onSort, status, onStatusChange }) => {
  const [showLabel, setShowLabel] = useState(true);
  const renderSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortDirection === 'ASC' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
  };

  const handleChange = (event) => {
    onStatusChange(event.target.value);
    if (showLabel) {
      setShowLabel(false);
    }
  };

  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        marginTop: 1,
        maxHeight: '63vh',
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
            padding: '8px 16px',
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell onClick={() => onSort('name')} style={{ cursor: 'pointer' }}>
              Name {renderSortIcon('name')}
            </TableCell>
            <TableCell align="center">Category</TableCell>
            <TableCell align="center">Unit</TableCell>
            <TableCell align="center" onClick={() => onSort('stockQuantity')} style={{ cursor: 'pointer' }}>
              Stock Qty {renderSortIcon('stockQuantity')}
            </TableCell>
            <TableCell align="center" onClick={() => onSort('sellingPrice')} style={{ cursor: 'pointer' }}>
              Selling Price {renderSortIcon('sellingPrice')}
            </TableCell>
            <TableCell align="center">MRP</TableCell>
            <TableCell align="center">
            <FormControl variant="standard" sx={{ minWidth: 70 }}>
                {status === "" && (
                  <InputLabel
                    sx={{
                      transform: 'translate(0, 6px) scale(1)',
                      fontSize: '14.5px',
                      fontWeight: 'bold',
                      color: 'black',
                    }}
                  >
                    Status
                  </InputLabel>
                )}
                <Select sx={{ fontWeight: 'bold', fontSize: '15px' }} value={status} onChange={handleChange} disableUnderline>
                  <MenuItem sx={{ fontWeight: 'bold' }} value="">All</MenuItem>
                  <MenuItem sx={{ fontWeight: 'bold' }} value="active">Active</MenuItem>
                  <MenuItem sx={{ fontWeight: 'bold' }} value="out of stock">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell component="th" scope="row">{item.name}</TableCell>
              <TableCell align="center">{item.category}</TableCell>
              <TableCell align="center">{item.unit}</TableCell>
              <TableCell align="center">{item.stockQuantity}</TableCell>
              <TableCell align="center">{item.sellingPrice}</TableCell>
              <TableCell align="center">{item.mrpPrice}</TableCell>
              <TableCell align="center">
                <Chip label={item.status} color={item.status === 'active' ? 'success' : 'default'} size="small" />
              </TableCell>
              <TableCell align="center">
                <Tooltip title="View">
                  <IconButton onClick={() => onView(item.id)} size="small" color="primary">
                    <Visibility />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton onClick={() => onEdit(item.id)} size="small" color="primary">
                    <Edit />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ItemTable;
