import React, { useEffect, useRef } from 'react';
import { Drawer, Button, Typography, TextField, Box, Grid } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { addCategory, getCategoryById, updateCategory } from '../../Service/Category.api';
import { CategoryValidation } from '../../Common/Validation';
import { yupResolver } from "@hookform/resolvers/yup";
import CustomSnackbar, { successSnackbar, errorSnackbar } from '../../Common/Snackbar';

function CategoryDrawer({ open, handleClose, categoryId, onRefresh }) {
  const snackbarRef = useRef();
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


  const handleFormSubmit = async (data) => {
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
          console.log('Update Response:', response);
          if (response?.error?.data?.message) {
            errorSnackbar("Error", snackbarRef); // Show error snackbar
          } else {
            successSnackbar("Category updated successfully", snackbarRef); // Show success snackbar
            onRefresh();
            reset();
            handleClose();
          }
        })
        .catch((error) => {
          console.log('Update Error:', error);
          errorSnackbar("Error while updating", snackbarRef); // Show error snackbar on catch
        });
    } else {
      try {
        const response = await addCategory(createPayload);
        console.log('Add Response:', response);
        
        // Make sure you're comparing the correct status value
        if (response.status === "200") {
          onRefresh();
          reset();
          successSnackbar('Category added successfully', snackbarRef);
          handleClose();
        } else {
          errorSnackbar("Error while adding category", snackbarRef); // Show error snackbar
        }
      } catch (error) {
        console.log('Add Error:', error);
        errorSnackbar("Error while adding category", snackbarRef); // Show error snackbar
      }
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
            <Typography variant="body1" sx={{ color: '#ccc' }}>Name</Typography>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  type="text"
                  {...register("name")}
                  placeholder="Enter name*"
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
            <Typography variant="body1" sx={{ color: '#ccc' }}>Description</Typography>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  type="text"
                  {...register("description")}
                  placeholder="Enter description*"
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
            <Typography variant="body1" sx={{ color: '#ccc' }}>GST Percent</Typography>
            <Controller
              name="gstPercent"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  type="number"
                  {...register("gstPercent")}
                  placeholder="Enter GST percentage*"
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
      <CustomSnackbar ref={snackbarRef}/>
    </Drawer>
  );
}

export default CategoryDrawer;
