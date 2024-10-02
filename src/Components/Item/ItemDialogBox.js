import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogTitle, Button, DialogContent, Grid2, Typography, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { addItem, updateItem, getItemById } from '../../Service/ItemApi';
import { getCategoriesDropdown } from '../../Service/CategoryApi';

function ItemDialogBox({ open, handleClose, itemId, onRefresh }) {
  const { control, handleSubmit, register, reset, setValue } = useForm();
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
      catgoryDropdown();
    }
  }, [itemId, open]);

  const fetchData = async () => {
    const data = await getItemById(itemId);
    setValue("name", data?.name);
    setValue("mrpPrice", data?.mrpPrice);
    setValue("sellingPrice", data?.sellingPrice);
    setValue("stockQuantity", data?.stockQuantity);
    setValue("status", data?.status);
    setValue("categoryId", data?.categoryId);
  }
  
    const catgoryDropdown = async () => {
      getCategoriesDropdown().then(response => {
        console.log('Raw API Response:', response);
        if (response && Array.isArray(response)) {
          console.log('Categories:', response);
          setCategories(response);
        } else {
          console.error('No data found in API response.');
        }
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
    };

  const handleFormSubmit = (data) => {
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

    if(itemId){
      updateItem(updatePayload)
      .then((response) => {
        if (response?.error?.data?.message) {
          alert("Error", `${response.error.data.message}`, "");
        } else {
          alert("Success");
          onRefresh();
          reset();
          handleClose();
        }
      })
      .catch((error) => {
        alert("ERROR LOL");
      });
    } else {
      addItem(createPayload)
        .then((response) => {
          if (response?.error?.data?.message) {
            alert("Error", `${response.error.data.message}`, "");
          } else {
            alert("Success");
            onRefresh();
            reset();
            handleClose();
          }
        })
        .catch((error) => {
          alert("ERROR LOL");
        });
      }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose} sx={{ borderRadius: "10px" }}>
      <DialogTitle>Add Item</DialogTitle>
      <DialogContent sx={{ paddingRight: 0, paddingLeft: 8 }} className='custom-scrollbar'>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid2 container spacing={2} sx={{ width: "92%" }}>
            <Grid2 xs={6}>
              <Typography>Name</Typography>
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
                  />
                )}
              />
            </Grid2>

            <Grid2 xs={6}>
              <Typography>MRP</Typography>
              <Controller
                name="mrpPrice"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    type="number"
                    {...register("mrpPrice")}
                    placeholder="Enter MRP"
                    {...field}
                    size="small"
                    fullWidth
                  />
                )}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={2} sx={{ marginTop: "20px", width: "92%" }}>
            <Grid2 xs={6}>
              <Typography>GST</Typography>
              <Controller
                name="sellingPrice"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    type="number"
                    {...register("sellingPrice")}
                    placeholder="Enter Selling Price"
                    {...field}
                    size="small"
                    fullWidth
                  />
                )}
              />
            </Grid2>

            <Grid2 xs={6}>
              <Typography>Stock Qty</Typography>
              <Controller
                name="stockQuantity"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    type="number"
                    {...register("stockQuantity")}
                    placeholder="Enter Stock No"
                    {...field}
                    size="small"
                    fullWidth
                  />
                )}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={2} sx={{ marginTop: "20px", width: "92%" }}>
  <Grid2 xs={6}>
    <Typography>Status</Typography>
    <Controller
      name="status"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <TextField
          type="text"
          {...register("status")}
          placeholder="Enter status"
          {...field}
          size="small"
          fullWidth
        />
      )}
    />
  </Grid2>

  <Grid2 xs={6}>
    <Typography>Category</Typography>
    <Controller
      name="categoryId"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <FormControl fullWidth size='small' sx={{ minWidth: 224 }}>
          <Select
            {...field}
            label="Select category"
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select category
            </MenuItem>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No Categories Available</MenuItem>
            )}
          </Select>
        </FormControl>
      )}
    />
  </Grid2>
</Grid2>


          <DialogActions>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ marginRight: "10px" }}>
              Close
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "green",
                "&:hover": {
                  bgcolor: "#198c39",
                },
                marginRight: "65px",
              }}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ItemDialogBox;
