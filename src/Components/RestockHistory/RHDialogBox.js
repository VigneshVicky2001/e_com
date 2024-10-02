import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogTitle, Button, DialogContent, Grid2, Typography, TextField, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { addRestockHistory, updateRestockHistory, getRestockHistoryById } from '../../Service/RestockApi';
import { getAllItemAndName } from '../../Service/ItemApi';
import { getDistributorNameAndId } from '../../Service/DistributorApi';

function RHDialogBox({ open, handleClose, RHId, onRefresh }) {

    const [distributors, setDistributors] = useState([]);
    const [items, setItems] = useState([]);
    const { control, handleSubmit, register, setValue, reset } = useForm();
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
                alert("error");
              } else {
                alert("success");
                onRefresh();
                reset();
                handleClose();
              }
            })
            .catch((error) => {
              alert("ERROR LOL: ", error);
            });
        } else {
          addRestockHistory(createPayload)
            .then((response) => {
              if (response?.error?.data?.message) {
                alert("error", `${response.error.data.message}`, "");
              } else {
                alert("Success!");
                onRefresh();
                reset();
                handleClose();
              }
            })
            .catch((error) => {
              alert("ERROR bro");
            });
        }
      };


  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose} sx={{ borderRadius: "10px" }}>
        {RHId ? <DialogTitle>Add Restock History</DialogTitle> : <DialogTitle>Edit Restock History</DialogTitle>}
        <DialogContent sx={{ paddingRight: 0, paddingLeft: 8 }} className='custom-scrollbar'>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Grid2 container spacing={2} sx={{ width: "92%" }}>
                    <Grid2 xs={6}>
                      <Typography>
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
                          />
                        )}
                      />
                    </Grid2>

                    <Grid2 xs={6}>
                        <Typography>
                            Adjustment Type
                        </Typography>
                        {/* <Controller
                        name="adjustment_type"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            type="text"
                            {...register("adjustment_type")}
                            placeholder="Enter Type"
                            {...field}
                            size="small"
                            fullWidth
                          />
                        )}
                      /> */}

                        <Controller
                          name="adjustment_type"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <FormControl fullWidth size='small' sx={{ minWidth: 224 }}>
                              {/* <InputLabel>Select category</InputLabel> */}
                              <Select
                                {...field}
                                label="Select type"
                                fullWidth
                                displayEmpty
                              >
                                <MenuItem value="" disabled>
                                  Select type
                                </MenuItem>
                                <MenuItem value="restock">restock</MenuItem>
                                <MenuItem value="return to supplier">return to supplier</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                    </Grid2>
                </Grid2>
                <Grid2 container spacing={2} sx={{ marginTop: "20px", width: "92%" }}>
                    <Grid2 xs={6}>
                        <Typography>
                          Distributor
                        </Typography>
                        <Controller
                          name="distibutorId"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <FormControl fullWidth size='small' sx={{ minWidth: 224 }}>
                              {/* <InputLabel>Select category</InputLabel> */}
                              <Select
                                {...field}
                                label="Select distributor"
                                fullWidth
                                displayEmpty
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
                            </FormControl>
                          )}
                        />
                    </Grid2>
                </Grid2>
                <Grid2 container spacing={2} sx={{ marginTop: "20px", width: "92%" }}>
                    <Grid2 xs={6}>
                        <Typography>
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
                            <FormControl fullWidth size='small' sx={{ minWidth: 224 }}>
                              <Select
                                {...field}
                                label="Select Items"
                                fullWidth
                                displayEmpty
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
                            </FormControl>
                          )}
                        />
                    </Grid2>
                </Grid2>
                <DialogActions>
            <Button variant="outlined"
                onClick={() => {
                  handleClose();
                }}
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

export default RHDialogBox;
