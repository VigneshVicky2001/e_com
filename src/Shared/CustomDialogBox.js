import { React } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

export const CustomDialog = ({ isOpen, onClose, title, content }) => {
    return (
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <button onClick={onClose} autoFocus>
            Close
          </button>
        </DialogActions>
      </Dialog>
    );
  };
