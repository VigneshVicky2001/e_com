import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Button, TablePagination } from '@mui/material';
import { getAllCategories, updateCategory, getCategoriesDropdown } from '../../Service/Category.api';
import CustomerTable from './CustomerTable';
import useProgressBar from '../../Common/ProgressBar';
import { getAllCustomers } from '../../Service/Customer.api';

export default function Customer() {
  const { startProgress, stopProgress } = useProgressBar();
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('Name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const filters = useMemo(() => ({
    page,
    size: rowsPerPage,
  }), [page, rowsPerPage]);

  const fetchData = async () => {
    try {
      const response = await getAllCustomers(page, rowsPerPage, sortBy, sortDirection);
      setLoading(false);
      setCustomers(response.customers);
      // setPage(response.currentPage);
      setTotalCustomers(response.totalItems);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, [filters, sortDirection, page, rowsPerPage]);

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

  return (
    <Box sx={{
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2, 
      padding: 3, 
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography 
          variant="h4" 
          sx={{ 
            letterSpacing: '0.1em', 
            textShadow: '0px 0px 10px rgba(255,255,255,0.4)' 
          }}
        >
          Customers
        </Typography>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <CustomerTable
            customers={customers}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <TablePagination
            component="div"
            count={totalCustomers}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

    </Box>
  );
}