import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Button, TextField, Select, MenuItem, TablePagination } from '@mui/material';
import { getItems } from '../../Service/ItemApi';
import ItemDialogBox from './ItemDialogBox';
import ItemTable from './ItemTable';
import { FormControl, InputLabel } from '@mui/material';
import useProgressBar from '../../Common/ProgressBar';

export default function Item() {
  const { startProgress, stopProgress } = useProgressBar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [stockQuantity, setStockQuantity] = useState(-1);
  const [sellingPrice, setSellingPrice] = useState(-1);
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('ASC');
  const [totalItems, setTotalItems] = useState(0);
  const [DialogOpen, setDialogOpen] = useState(false);

  const filters = useMemo(() => ({
    page,
    size: rowsPerPage,
    name,
    sellingPrice,
    stockQuantity,
    status,
    sortBy,
    sortDirection,
  }), [page, rowsPerPage, name, sellingPrice, stockQuantity, status, sortBy, sortDirection]);

  const [itemId, setItemId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    try {
      startProgress();
      setLoading(true);
      const data = await getItems(filters);
      setItems(data.itemDetails || []);
      setTotalItems(data.count || 0);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      stopProgress();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection((prevDirection) => (prevDirection === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(column);
      setSortDirection('ASC');
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setItemId(null);
  };

  const handleEdit = (itemId) => {
    setItemId(itemId);
    setDialogOpen(true);
  };

  const handleView = (itemId) => {
    console.log(`pictore`);
  };

  const handleRefresh = () => {
    fetchItems();
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(0);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Items</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Add Item
        </Button>
      </Box>
      
      {/* <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={status}            onChange={(e) => {
              setStatus(e.target.value);

              setPage(0);
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="out of stock">Out of Stock</MenuItem>
          </Select>
        </FormControl>
      </Box> */}

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <ItemTable
            items={items}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
            onEdit={handleEdit}
            onView={handleView}
            status={status}
            onStatusChange={handleStatusChange}
          />
          <TablePagination
            component="div"
            count={totalItems}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      <ItemDialogBox open={DialogOpen} handleClose={handleCloseDialog} itemId={itemId} onRefresh={handleRefresh} />
    </Box>
  );
}
