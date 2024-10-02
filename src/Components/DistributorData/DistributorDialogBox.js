import React, { useEffect } from 'react';
import { Dialog, DialogActions, DialogTitle, Button, DialogContent, Grid2, Typography, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { addDistributor, updateDistributor, getDistributorById } from '../../Service/DistributorApi';

function DistributorDialogBox({ open, handleClose, distributorId, onRefresh }) {

    const { control, handleSubmit, register, setValue, reset } = useForm();
    useEffect(() => {
      if (open) {
        if (distributorId) {
          fetchData();
        } else {
          reset({
            name: '',
            contactInfo: '',
            address: '',
          });
        }
      }
    }, [distributorId, open]);

    const fetchData = async () => {
      const data = await getDistributorById(distributorId);
      console.log(data);
      setValue("name", data?.name || "");
      setValue("contactInfo", data?.contactInfo || "");
      setValue("address", data?.address || "");
    }

    const handleFormSubmit = (data) => {
        const updatePayload = {
          id: distributorId,
          name: data?.name,
          contactInfo: data?.contactInfo,
          address: data?.address
        };
    
        const createPayload = {
            name: data?.name,
            contactInfo: data?.contactInfo,
            address: data?.address
        };
    
        if (distributorId) {
            updateDistributor(updatePayload)
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
            addDistributor(createPayload)
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
        {distributorId ? <DialogTitle>Add Distributor</DialogTitle> : <DialogTitle>Edit Distributor</DialogTitle>}
        <DialogContent sx={{ paddingRight: 0, paddingLeft: 8 }} className='custom-scrollbar'>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Grid2 container spacing={2} sx={{ width: "92%" }}>
                    <Grid2 xs={6}>
                      <Typography>
                        Name
                      </Typography>
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
                        <Typography>
                            Contact info
                        </Typography>
                        <Controller
                        name="contactInfo"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            type="text"
                            {...register("contactInfo")}
                            placeholder="Enter contact info"
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
                        <Typography>
                          Address
                        </Typography>
                        <Controller
                        name="address"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            type="text"
                            {...register("address")}
                            placeholder="Enter address"
                            {...field}
                            size="small"
                            fullWidth
                          />
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

export default DistributorDialogBox;
