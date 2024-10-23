import React, { useEffect, useRef } from 'react';
import { Box, Dialog, DialogActions, DialogTitle, Button, DialogContent, Grid2, Typography, TextField, Drawer } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { addDistributor, updateDistributor, getDistributorById } from '../../Service/Distributor.api';
import { DistributorValidation } from '../../Common/Validation';
import { yupResolver } from '@hookform/resolvers/yup';

function DistributorDialogBox({ open, handleClose, distributorId, onRefresh, showSuccessSnackbar, showErrorSnackbar }) {
    const { 
      control,
      handleSubmit, 
      register, 
      setValue, 
      reset,
      formState: { errors },
    } = useForm({ resolver: yupResolver(DistributorValidation)});
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
                showErrorSnackbar("error");
              } else {
                showSuccessSnackbar("Distributor updated successfully!");
                onRefresh();
                reset();
                handleClose();
              }
            })
            .catch((error) => {
              showErrorSnackbar("ERROR LOL: ", error);
            });
        } else {
            addDistributor(createPayload)
            .then((response) => {
              if (response?.error?.data?.message) {
                showErrorSnackbar("error", `${response.error.data.message}`, "");
              } else {
                showSuccessSnackbar("Distributor added successfully!");
                onRefresh();
                reset();
                handleClose();
              }
            })
            .catch((error) => {
              showErrorSnackbar("ERROR");
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
            width: 300,
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
        {distributorId ? <DialogTitle>Edit Distributor</DialogTitle> : <DialogTitle>Add Distributor</DialogTitle>}
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Grid2 container spacing={2} sx={{ width: "92%" }}>
                    <Grid2 xs={6}>
                      <Typography variant="body1" sx={{ color: '#ccc' }}>
                        Name*
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
                            sx={{
                              width: '300px',
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
                        <Typography variant="body1" sx={{ color: '#ccc' }}>
                            Contact info*
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
                            sx={{
                              width: '300px',
                              input: { color: '#fff' },
                              backgroundColor: '#333',
                              borderRadius: '4px',
                            }}
                            helperText={errors.contactInfo?.message}
                            error={!!errors.contactInfo}
                          />
                        )}
                      />
                    </Grid2>
                </Grid2>
                <Grid2 container spacing={2} sx={{ marginTop: "20px", width: "92%" }}>
                    <Grid2 xs={6}>
                        <Typography variant="body1" sx={{ color: '#ccc' }}>
                          Address*
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
                            sx={{
                              width: '300px',
                              input: { color: '#fff' },
                              backgroundColor: '#333',
                              borderRadius: '4px',
                            }}
                            helperText={errors.address?.message}
                            error={!!errors.address}
                          />
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
    </Drawer>
  );
}

export default DistributorDialogBox;
