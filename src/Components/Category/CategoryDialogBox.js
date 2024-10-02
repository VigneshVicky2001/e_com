import React, { useEffect } from 'react';
import { Dialog, DialogActions, DialogTitle, Button, DialogContent, Grid2, Typography, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { addCategory, getCategoryById, updateCategory } from '../../Service/CategoryApi';

function CategoryDialogBox({ open, handleClose, categoryId, onRefresh }) {

    const { control, handleSubmit, register, setValue, reset } = useForm();
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
      console.log(data);
      setValue("name", data?.name || "");
      setValue("gstPercent", data?.gstPercent || "");
      setValue("description", data?.description || "");
      // console.log(data?.name);
    }

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
          addCategory(createPayload)
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
        {categoryId ? <DialogTitle>Add Category</DialogTitle> : <DialogTitle>Edit Category</DialogTitle>}
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
                          description
                        </Typography>
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
                          />
                        )}
                      />
                    </Grid2>
                </Grid2>
                <Grid2 container spacing={2} sx={{ marginTop: "20px", width: "92%" }}>
                <Grid2 xs={6}>
                        <Typography>
                          GST
                        </Typography>
                        <Controller
                        name="gstPercent"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            type="double"
                            {...register("gstPercent")}
                            placeholder="Enter gstPercent"
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

export default CategoryDialogBox;
