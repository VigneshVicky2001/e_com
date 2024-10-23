import React, { useEffect } from 'react';
import { Drawer, Button, Typography, TextField, Box, Grid } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { addCategory, getCategoryById, updateCategory } from '../../Service/Category.api';
import { CategoryValidation } from '../../Common/Validation';
import { yupResolver } from "@hookform/resolvers/yup";

function CategoryDrawer({ open, handleClose, categoryId, onRefresh, showSuccessSnackbar, showErrorSnackbar }) {
  const { 
    control, 
    handleSubmit, 
    register, 
    setValue, 
    reset,
    formState: { errors },
  } = useForm({resolver: yupResolver(CategoryValidation)});

  useEffect(() => {
    if (open) {
      if (categoryId) {
        fetchData();
      } else {
        reset({
          name: '',
          description: '',
          gstPercent: '',
        });
      }
    }
  }, [categoryId, open]);

  const fetchData = async () => {
    const data = await getCategoryById(categoryId);
    setValue("name", data?.name || "");
    setValue("gstPercent", data?.gstPercent || "");
    setValue("description", data?.description || "");
  };

  const handleFormSubmit = (data) => {
    const updatePayload = {
      id: categoryId,
      name: data?.name,
      description: data?.description,
      gstPercent: parseFloat(data?.gstPercent),
      status: true,
    };

    const createPayload = {
      name: data?.name,
      description: data?.description,
      gstPercent: parseFloat(data?.gstPercent),
      status: true,
    };

    if (categoryId) {
      updateCategory(updatePayload)
        .then((response) => {
          if (response?.error?.data?.message) {
            showErrorSnackbar("Error updating category");
          } else {
            showSuccessSnackbar("Category updated successfully");
            onRefresh();
            reset();
            handleClose();
          }
        })
        .catch((error) => {
          showErrorSnackbar("Error while updating");
        });
    } else {
      addCategory(createPayload)
        .then((response) => {
          if (response?.error?.data?.message) {
            showErrorSnackbar("Error adding category");
          } else {
            showSuccessSnackbar("Category added successfully");
            onRefresh();
            reset();
            handleClose();
          }
        })
        .catch((error) => {
          showErrorSnackbar("Error while adding category");
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
      <Typography >
        {categoryId ? 'Edvariant="h5" sx={{ marginBottom: 2, color: "#fff" }}it Category' : 'Add Category'}
      </Typography>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography variant="body1" sx={{ color: '#ccc' }}>Name*</Typography>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  type="text"
                  {...register("name")}
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
          </Grid>

          <Grid item>
            <Typography variant="body1" sx={{ color: '#ccc' }}>Description*</Typography>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  type="text"
                  {...register("description")}
                  placeholder="Enter description"
                  {...field}
                  size="small"
                  fullWidth
                  sx={{
                    input: { color: '#fff' },
                    backgroundColor: '#333',
                    borderRadius: '4px',
                  }}
                  helperText={errors.description?.message}
                  error={!!errors.description}
                />
              )}
            />
          </Grid>

          <Grid item>
            <Typography variant="body1" sx={{ color: '#ccc' }}>GST Percent*</Typography>
            <Controller
              name="gstPercent"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  type="number"
                  {...register("gstPercent")}
                  placeholder="Enter GST percentage"
                  {...field}
                  size="small"
                  fullWidth
                  sx={{
                    input: { color: '#fff' },
                    backgroundColor: '#333',
                    borderRadius: '4px',
                  }}
                  helperText={errors.gstPercent?.message}
                  error={!!errors.gstPercent}
                />
              )}
            />
          </Grid>
        </Grid>

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
    </Drawer>
  );
}

export default CategoryDrawer;
