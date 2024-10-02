import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Switch, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import useProgressBar from '../../Common/ProgressBar';
import { getCategoryById, updateCategory } from '../../Service/CategoryApi';

const CategoryTable = ({ categories, onEdit, onRefresh }) => {
  const { startProgress, stopProgress } = useProgressBar();
  const [DialogOpen, setDialogOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gstPercent, setGstPercent] = useState(null);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (categoryId !== null) {
      fetchData();
    }
  }, [categoryId]);

  const fetchData = async () => {
    const data = await getCategoryById(categoryId);
    setName(data?.name);
    setDescription(data?.description);
    setGstPercent(data?.gstPercent);
    data?.status === true ? setStatus(false) : setStatus(true);
  }

  const update = async () => {
    try {
      startProgress();
      const response = await updateCategory({
        id: categoryId,
        name: name,
        description: description,
        gstPercent: gstPercent,
        status: status,
      })
        .then((response) => {
          if(response?.error?.data?.message) {
            alert("error");
          } else {
            // alert("successsful");
            onRefresh();
            handleCloseDialog();
          }
        })
    } catch (error) {
      alert(error.message);
    } finally {
      stopProgress();
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleStatusSwitch = (Id) => {
    setCategoryId(Id);
    setDialogOpen(true);
  };

  const handleStatusChange = () => {
    update();
  }

  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        marginTop: 1
      }}
    >
      <Table
        aria-label="custom category table"
        sx={{
          '& thead th': {
            fontWeight: 'bold',
            background: 'rgba(0, 0, 0, 0.1)',
          },
          '& tbody tr:hover': {
            background: 'rgba(255, 255, 255, 0.08)',
            transition: '0.3s ease',
          },
          '& tbody td': {
            textShadow: '0px 0px 8px rgba(255,255,255,0.3)',
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">GST %</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} hover>
              <TableCell>
                {category.name}
              </TableCell>
              <TableCell align="right">{category.gstPercent}%</TableCell>
              <TableCell align="center">
                <Switch
                  checked={category.status === true}
                  onClick={() => handleStatusSwitch(category.id)}
                  color="#c1c1c1"
                  sx={{
                    '& .MuiSwitch-thumb': {
                      backgroundColor: "#333333",
                    },
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton
                    onClick={() => onEdit(category.id)}
                    sx={{
                      color: '#333333',
                      '&:hover': {
                        color: '#ff4081',
                        transition: '0.3s ease',
                      },
                      '&:active': {
                        transition: '0.3s ease',
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="More options">
                  <IconButton
                    sx={{
                      color: '#333333',
                      '&:hover': {
                        color: '#ff4081',
                        transition: '0.3s ease',
                      },
                      '&:active': {
                        transition: '0.3s ease',
                      },
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={DialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Status"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to change the status?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleStatusChange} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

    </TableContainer>
  );
};

export default CategoryTable;
