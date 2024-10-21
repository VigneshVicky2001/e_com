import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography, Button, TextField, Select, MenuItem, TablePagination } from '@mui/material';
import { getItems } from '../../Service/Item.api';
import ItemDialogBox from './ItemDialogBox';
import ItemTable from './ItemTable';
import { FormControl, InputLabel } from '@mui/material';
import useProgressBar from '../../Common/ProgressBar';
import CustomSnackbar, { successSnackbar, errorSnackbar } from '../../Common/Snackbar';

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
  const snackbarRef = useRef(null);

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

  const showSuccessSnackbar = (message) => {
    successSnackbar(message, snackbarRef);
  };
  
  const showErrorSnackbar = (message) => {
    errorSnackbar(message, snackbarRef);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Items</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Add Item
        </Button>
      </Box>

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

      <ItemDialogBox
        open={DialogOpen}
        handleClose={handleCloseDialog}
        itemId={itemId}
        onRefresh={handleRefresh}
        showSuccessSnackbar={showSuccessSnackbar}
        showErrorSnackbar={showErrorSnackbar}
      />
      <CustomSnackbar ref={snackbarRef} />      
    </Box>
  );
}
