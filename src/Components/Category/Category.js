import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Button, TablePagination } from '@mui/material';
import { getAllCategories, updateCategory, getCategoriesDropdown } from '../../Service/CategoryApi';
import CategoryDialogBox from './CategoryDialogBox';
import CategoryTable from './CategoryTable';
import useProgressBar from '../../Common/ProgressBar';

export default function Category() {
  const { startProgress, stopProgress } = useProgressBar();
  const [categories, setCategories] = useState([]);
  const [DialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

  const filters = useMemo(() => ({
    page,
    size: rowsPerPage,
  }), [page, rowsPerPage]);

  const fetchCategories = async () => {
    try {
      startProgress();
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      stopProgress();
    }
  };

  // const updateCategory = async () => {
  //   try {
  //     startProgress();
  //     setLoading(true);
  //     const response = await updateCategory({
  //       id: categoryId,
  //       name: data?.name,
  //       description: data?.description,
  //       gstPercent: parseFloat(data?.gstPercent),
  //       status: true,
  //     })
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     stopProgress();
  //   }
  // }

  useEffect(() => {
    fetchCategories();
  }, [filters]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCategoryId(null);
  };

  const handleEdit = (categoryId) => {
    setCategoryId(categoryId);
    setDialogOpen(true);
  };

  const handleRefresh = () => {
    fetchCategories();
  };

  // const handleStatusSwitch = (categoryId) => {

  // }

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
          Category
        </Typography>
          <Button
            variant="contained"
            onClick={handleOpenDialog}
            sx={{
              backgroundColor: '#333333',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              boxShadow: `0px 0px 10px #333333, inset 0px -3px 10px rgba(255, 255, 255, 0.1)`,
              transition: 'box-shadow 0.3s ease, transform 0.3s ease',
              '&:hover': {
                color: '#333333',
                backgroundColor: '#c1c1c1',
                transform: 'scale(0.94)',
                boxShadow: `inset 0px 0px 15px rgba(0, 0, 0, 0)`,
                transition: '0.3s ease, transform 0.3s ease',
              },
              '&:active': {
                boxShadow: `inset 0px 0px 15px rgba(0, 0, 0, 1)`,
                transform: 'scale(0.95)',
              },
              textShadow: '0px 0px 12px rgba(255,255,255,0.5)',
            }}
            size="large"
          >
            Add Category
          </Button>


      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <CategoryTable
            categories={categories}
            onEdit={handleEdit}
            onRefresh={handleRefresh}
          />
          <TablePagination
            component="div"
            count={categories.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      <CategoryDialogBox open={DialogOpen} handleClose={handleCloseDialog} categoryId={categoryId} onRefresh={handleRefresh} />
    </Box>
  );
}
