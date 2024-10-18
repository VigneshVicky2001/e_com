import React, { useEffect, useState, useRef } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Switch,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TablePagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useProgressBar from '../../Common/ProgressBar';
import { getCategoryById, updateCategory } from '../../Service/Category.api';

const CategoryTable = ({ categories, onEdit, onRefresh, page, rowsPerPage  }) => {
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
          if (response?.error?.data?.message) {
            // errorSnackbar("error");
          } else {
            // successSnackbar("successful");
            onRefresh();
            handleCloseDialog();
          }
        })
    } catch (error) {
      // errorSnackbar(error.message);
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
  };

  const paginatedCategories = categories.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        marginTop: 1,
        maxHeight: 800,
        overflowY: 'auto',
      }}
    >
      <Table
        stickyHeader
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
          '& .MuiTableCell-root': {
            padding: '8px 16px',
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
          {paginatedCategories.map((category) => (
            <TableRow key={category.id} hover>
              <TableCell>{category.name}</TableCell>
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
        <DialogTitle id="alert-dialog-title">{"Status"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to change the status?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleStatusChange} autoFocus>Yes</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>


  );
};

export default CategoryTable;
