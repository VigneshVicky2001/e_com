import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Button, Typography, TextField, Select, MenuItem, FormControl, Grid2, Box, FormHelperText } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { addItem, updateItem, getItemById } from '../../Service/Item.api';
import { getCategoriesDropdown } from '../../Service/Category.api';
import { yupResolver } from '@hookform/resolvers/yup';
import { ItemValidation } from '../../Common/Validation';
import CustomSnackbar, {successSnackbar, errorSnackbar} from '../../Common/Snackbar';

function ItemDrawer({ open, handleClose, itemId, onRefresh }) {
  const snackbarRef = useRef();
  const { 
    control, 
    handleSubmit, 
    register, 
    reset, 
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(ItemValidation) });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (open) {
      if (itemId) {
        fetchData();
      } else {
        reset({
          name: '',
          mrpPrice: '',
          sellingPrice: '',
          stockQuantity: '',
          status: '',
          categoryId: '',
        });
      }
      categoryDropdown();
    }
  }, [itemId, open]);

  const fetchData = async () => {
    const data = await getItemById(itemId);
    setValue('name', data?.name);
    setValue('mrpPrice', data?.mrpPrice);
    setValue('sellingPrice', data?.sellingPrice);
    setValue('stockQuantity', data?.stockQuantity);
    setValue('status', data?.status);
    setValue('categoryId', data?.categoryId);
  };

  const categoryDropdown = async () => {
    getCategoriesDropdown()
      .then(response => {
        if (response && Array.isArray(response)) {
          setCategories(response);
        } else {
          console.error('No data found in API response.');
        }
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  };

  const handleFormSubmit = data => {
    const updatePayload = {
      id: itemId,
      name: data?.name,
      mrpPrice: parseFloat(data?.mrpPrice),
      sellingPrice: parseFloat(data?.sellingPrice),
      stockQuantity: data?.stockQuantity,
      status: data?.status,
      categoryId: data?.categoryId,
    };

    const createPayload = {
      name: data?.name,
      mrpPrice: parseFloat(data?.mrpPrice),
      sellingPrice: parseFloat(data?.sellingPrice),
      stockQuantity: data?.stockQuantity,
      status: data?.status,
      categoryId: data?.categoryId,
    };

    if (itemId) {
      updateItem(updatePayload)
        .then(response => {
          if (response?.error?.data?.message) {
            errorSnackbar(`Error: ${response.error.data.message}`);
          } else {
            successSnackbar('Success');
            onRefresh();
            reset();
            handleClose();
          }
        })
        .catch(error => {
          errorSnackbar('ERROR bro');
        });
    } else {
      addItem(createPayload)
        .then(response => {
          if (response?.error?.data?.message) {
            errorSnackbar(`Error: ${response.error.data.message}`);
          } else {
            successSnackbar('Success');
            onRefresh();
            reset();
            handleClose();
          }
        })
        .catch(error => {
          errorSnackbar('ERROR bro');
        });
    }
  };

  return (
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            padding: 3,
            boxShadow: 3,
            backgroundColor: '#1f1f1f',
            color: '#fff',
            borderRadius: "8px"
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
          },
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2, color: "#fff" }}>
          {itemId ? 'Edit Item' : 'Add Item'}
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid2  container direction="column" spacing={2}>
            <Grid2 xs={12}>
              <Typography variant="body1" sx={{ color: '#ccc' }}>Name</Typography>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    type="text"
                    {...register('name')}
                    placeholder="Enter name"
                    {...field}
                    size="small"
                    fullWidth
                    sx={{
                      input: { color: '#fff' },
                      backgroundColor: '#333',
                      borderRadius: '4px',
                    }}
                    helperText={errors.name?.message}
                    error={!!errors.name}
                  />
                )}
              />
            </Grid2>

            <Grid2 xs={6}>
              <Typography variant="body1" sx={{ color: '#ccc' }}>MRP</Typography>
              <Controller
                name="mrpPrice"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    type="number"
                    {...register('mrpPrice')}
                    placeholder="Enter MRP"
                    {...field}
                    size="small"
                    fullWidth
                    sx={{
                      input: { color: '#fff' },
                      backgroundColor: '#333',
                      borderRadius: '4px',
                    }}
                    helperText={errors.mrpPrice?.message}
                    error={!!errors.mrpPrice}
                  />
                )}
              />
            </Grid2>

            <Grid2 xs={6}>
              <Typography variant="body1" sx={{ color: '#ccc' }}>Selling Price</Typography>
              <Controller
                name="sellingPrice"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    type="number"
                    {...register('sellingPrice')}
                    placeholder="Enter Selling Price"
                    {...field}
                    size="small"
                    fullWidth
                    sx={{
                      input: { color: '#fff' },
                      backgroundColor: '#333',
                      borderRadius: '4px',
                    }}
                    helperText={errors.sellingPrice?.message}
                    error={!!errors.sellingPrice}
                  />
                )}
              />
            </Grid2>

            <Grid2 xs={6}>
              <Typography variant="body1" sx={{ color: '#ccc' }}>Stock Quantity</Typography>
              <Controller
                name="stockQuantity"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    type="number"
                    {...register('stockQuantity')}
                    placeholder="Enter Stock No"
                    {...field}
                    size="small"
                    fullWidth
                    sx={{
                      input: { color: '#fff' },
                      backgroundColor: '#333',
                      borderRadius: '4px',
                    }}
                    helperText={errors.stockQuantity?.message}
                    error={!!errors.stockQuantity}
                  />
                )}
              />
            </Grid2>

            <Grid2 xs={6}>
              <Typography variant="body1" sx={{ color: '#ccc' }}>Status</Typography>
              <Controller
                name="status"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    type="text"
                    {...register('status')}
                    placeholder="Enter Status"
                    {...field}
                    size="small"
                    fullWidth
                    sx={{
                      input: { color: '#fff' },
                      backgroundColor: '#333',
                      borderRadius: '4px',
                    }}
                    helperText={errors.status?.message}
                    error={!!errors.status}
                  />
                )}
              />
            </Grid2>

            <Grid2 xs={12}>
              <Typography variant="body1" sx={{ color: '#ccc' }}>Category</Typography>
              <FormControl 
                fullWidth 
                size="small"
                error={!!errors.categoryId}
                sx={{ marginBottom: 2 }}
              >
                <Controller
                  name="categoryId"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <Select
                        {...field}
                        label="Select Category"
                        displayEmpty
                        sx={{
                          input: { color: '#fff' },
                          backgroundColor: '#333',
                          borderRadius: '4px',
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select category
                        </MenuItem>
                        {categories && categories.length > 0 ? (
                          categories.map(category => (
                            <MenuItem key={category.id} value={category.id}>
                              {category.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No Categories Available</MenuItem>
                        )}
                      </Select>
                      {errors.categoryId && (
                        <FormHelperText error sx={{ color: '#f44336' }}>
                          {errors.categoryId?.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Grid2>
          </Grid2>

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                marginRight: 2,
                color: '#ccc',
                borderColor: '#666',
                "&:hover": {
                  borderColor: '#999',
                }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#198c39",
                "&:hover": {
                  bgcolor: "#145d2a",
                },
              }}
            >
              Save
            </Button>
          </Box>
        </form>
        <CustomSnackbar ref={snackbarRef}/>
      </Drawer>
  );
}

export default ItemDrawer;
