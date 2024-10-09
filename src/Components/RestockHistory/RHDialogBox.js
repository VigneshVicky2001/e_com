import React, { useEffect, useState, useRef } from 'react';
import { FormHelperText, Box, Drawer, Dialog, DialogActions, DialogTitle, Button, DialogContent, Grid2, Typography, TextField, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { addRestockHistory, updateRestockHistory, getRestockHistoryById } from '../../Service/Restock.api';
import { getAllItemAndName } from '../../Service/Item.api';
import { getDistributorNameAndId } from '../../Service/Distributor.api';
import { StockHistoryValidation } from '../../Common/Validation';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomSnackbar, {successSnackbar, errorSnackbar} from '../../Common/Snackbar';

function RHDialogBox({ open, handleClose, RHId, onRefresh }) {
    const snackbarRef = useRef();
    const [distributors, setDistributors] = useState([]);
    const [items, setItems] = useState([]);
    const { 
      control, 
      handleSubmit, 
      register, 
      setValue, 
      reset,
      formState: { errors },
    } = useForm({ resolver: yupResolver(StockHistoryValidation)});
    useEffect(() => {
      if (open) {
        fetchDistributors();
        fetchItems();
        if (RHId) {
          fetchData();
        } else {
          reset({
            adjustment_quantity: '',
            adjustment_type: '',
            adjustment_date: '',
            distibutorId: '',
            buyingPrice: '',
            itemId: '',
          });
        }
      }
    }, [RHId, open]);

    const fetchDistributors = async () => {
      try{
        const data = await getDistributorNameAndId();
        setDistributors(data);
      } catch {
        alert('error');
      }
    };

    const fetchItems = async () => {
      try{
        const data = await getAllItemAndName();
        setItems(data);
      } catch {
        alert('error');
      }
    };

    const fetchData = async () => {
      const data = await getRestockHistoryById(RHId);
      console.log(data);
      setValue("adjustmentQuantity", data?.adjustment_quantity || "");
      setValue("adjustmentType", data?.adjustment_type || "");
      // setValue("adjustment_date", data?.adjustment_date || "");
      setValue("distibutorId", data?.distibutorId || "");
      setValue("buyingPrice", data?.buyingPrice || "");
      setValue("itemId", data?.itemId || "");
    }

    const handleFormSubmit = (data) => {
        const updatePayload = {
          id: RHId,
          adjustment_quantity: Number(data?.adjustment_quantity),
          adjustment_type: data?.adjustment_type,
          // adjustment_date: new Date(data?.adjustment_date).toISOString(),
          distibutorId: Number(data?.distibutorId),
          buyingPrice: Number(data?.buyingPrice),
          itemId: Number(data?.itemId),
        };
    
        const createPayload = {
            adjustment_quantity: Number(data?.adjustment_quantity),
            adjustment_type: data?.adjustment_type,
            // adjustment_date: new Date(data?.adjustment_date).toISOString(),
            distibutorId: Number(data?.distibutorId),
            buyingPrice: Number(data?.buyingPrice),
            itemId: Number(data?.itemId),
        };
    
        if (RHId) {
          updateRestockHistory(updatePayload)
            .then((response) => {
              if (response?.error?.data?.message) {
                errorSnackbar("error");
              } else {
                successSnackbar("History updated successfully!");
                onRefresh();
                reset();
                handleClose();
              }
            })
            .catch((error) => {
              errorSnackbar("ERROR : ", error);
            });
        } else {
          addRestockHistory(createPayload)
            .then((response) => {
              if (response?.error?.data?.message) {
                errorSnackbar("error", `${response.error.data.message}`, "");
              } else {
                successSnackbar("History added successfully!");
                onRefresh();
                reset();
                handleClose();
              }
            })
            .catch((error) => {
              errorSnackbar("ERROR");
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
      {RHId ? <DialogTitle>Edit Restock History</DialogTitle> : <DialogTitle>Add Restock History</DialogTitle>}
    </Typography>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Grid2 container spacing={2} sx={{ width: "92%" }}>
                    <Grid2 xs={6}>
                      <Typography variant="body1" sx={{ color: '#ccc' }}>
                        Adjustment Qty
                      </Typography>
                      <Controller
                        name="adjustment_quantity"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            type="number"
                            {...register("adjustment_quantity")}
                            placeholder="Enter Quantity"
                            {...field}
                            size="small"
                            fullWidth
                            sx={{
                              input: { color: '#fff' },
                              backgroundColor: '#333',
                              borderRadius: '4px',
                            }}
                            helperText={errors.adjustment_quantity?.message}
                            error={!!errors.adjustment_quantity}
                          />
                        )}
                      />
                    </Grid2>
                    <Grid2 xs={6}>
                        <Typography variant="body1" sx={{ color: '#ccc' }}>
                            Adjustment Type
                        </Typography>
                        <Controller
                          name="adjustment_type"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <FormControl 
                              fullWidth 
                              size='small' 
                              sx={{ minWidth: 224 }}
                              error={!!errors.adjustment_type}
                            >
                              <Select
                                {...field}
                                label="Select type"
                                fullWidth
                                displayEmpty
                                sx={{
                                  input: { color: '#fff' },
                                  backgroundColor: '#333',
                                  borderRadius: '4px',
                                }}
                              >
                                <MenuItem value="" disabled>
                                  Select type
                                </MenuItem>
                                <MenuItem value="restock">restock</MenuItem>
                                <MenuItem value="return to supplier">return to supplier</MenuItem>
                              </Select>
                              {errors.adjustment_type && (
                                <FormHelperText error sx={{ color: '#f44336' }}>
                                  {errors.adjustment_type?.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          )}
                        />
                    </Grid2>
                </Grid2>
                <Grid2 container spacing={2} sx={{ marginTop: "20px", width: "92%" }}>
                    <Grid2 xs={6}>
                        <Typography variant="body1" sx={{ color: '#ccc' }}>
                          Distributor
                        </Typography>
                        <Controller
                          name="distibutorId"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <FormControl 
                              fullWidth 
                              size='small' 
                              sx={{ minWidth: 224 }}
                              error={!!errors.distibutorId}
                            >
                              {/* <InputLabel>Select category</InputLabel> */}
                              <Select
                                {...field}
                                label="Select distributor"
                                fullWidth
                                displayEmpty
                                sx={{
                                  input: { color: '#fff' },
                                  backgroundColor: '#333',
                                  borderRadius: '4px',
                                }}
                              >
                                <MenuItem value="" disabled>
                                  Select distributor
                                </MenuItem>
                                {distributors && distributors.length > 0 ? (
                                  distributors.map((distributor) => (
                                    <MenuItem key={distributor.id} value={distributor.id}>
                                      {distributor.name}
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem disabled>No Distributors Available</MenuItem>
                                )}
                              </Select>
                              {errors.distibutorId && (
                                <FormHelperText error sx={{ color: '#f44336' }}>
                                  {errors.distibutorId?.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          )}
                        />
                    </Grid2>
                </Grid2>
                <Grid2 container spacing={2} sx={{ marginTop: "20px", width: "92%" }}>
                    <Grid2 xs={6}>
                        <Typography variant="body1" sx={{ color: '#ccc' }}>
                            Buying Price
                        </Typography>
                            <Controller
                            name="buyingPrice"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                            <TextField
                                type="number"
                                {...register("buyingPrice")}
                                placeholder="Enter Price"
                                {...field}
                                size="small"
                                fullWidth
                                sx={{
                                  input: { color: '#fff' },
                                  backgroundColor: '#333',
                                  borderRadius: '4px',
                                }}
                                helperText={errors.buyingPrice?.message}
                                error={!!errors.buyingPrice}
                            />
                            )}
                        />
                        </Grid2>
                        <Grid2 xs={6}>
                        <Typography>Item</Typography>
                        <Controller
                          name="itemId"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <FormControl 
                              fullWidth 
                              size='small' 
                              sx={{ minWidth: 224 }}
                              error={!!errors.itemId}
                            >
                              <Select
                                {...field}
                                label="Select Items"
                                fullWidth
                                displayEmpty
                                sx={{
                                  input: { color: '#fff' },
                                  backgroundColor: '#333',
                                  borderRadius: '4px',
                                }}
                              >
                                <MenuItem value="" disabled>
                                  Select Items
                                </MenuItem>
                                {items && items.length > 0 ? (
                                  items.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                      {item.name}
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem disabled>No Items Available</MenuItem>
                                )}
                              </Select>
                              {errors.itemId && (
                                <FormHelperText error sx={{ color: '#f44336' }}>
                                  {errors.itemId?.message}
                                </FormHelperText>
                              )}
                            </FormControl>
                          )}
                        />
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
            <snackbarRef ref={snackbarRef}/>
        </Drawer>
  );
}

export default RHDialogBox;
