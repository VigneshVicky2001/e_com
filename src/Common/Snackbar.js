import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const CustomSnackbar = forwardRef((props, ref) => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useImperativeHandle(ref, () => ({
    openSnackbar(message, severity) {
      setSnackbarState({
        open: true,
        message,
        severity,
      });
    },
  }));

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarState({ ...snackbarState, open: false });

    // Reset the state after a short delay to allow the snackbar to reappear
    setTimeout(() => {
      setSnackbarState((prevState) => ({
        ...prevState,
        message: '',
        severity: 'success', // or whatever the default state you want
      }));
    }, 300);
  };

  const getIcon = (severity) => {
    switch (severity) {
      case 'success':
        return <CheckCircleIcon fontSize="inherit" />;
      case 'error':
        return <ErrorIcon fontSize="inherit" />;
      case 'warning':
        return <WarningIcon fontSize="inherit" />;
      case 'info':
        return <InfoIcon fontSize="inherit" />;
      default:
        return null;
    }
  };

  const slideTransition = (props) => {
    return <Slide {...props} direction={props.in ? 'down' : 'up'} />;
  };

  return (
    <Snackbar
      open={snackbarState.open}
      autoHideDuration={3000}
      onClose={handleClose}
      TransitionComponent={slideTransition}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        '& .MuiAlert-root': {
          fontSize: '1rem',
          backgroundColor: '#ffffff',
          color: '#333',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          padding: '12px 16px',
          minWidth: '300px',
        },
      }}
    >
      <Alert
        onClose={handleClose}
        severity={snackbarState.severity}
        icon={getIcon(snackbarState.severity)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          color: '#333',
          backgroundColor: '#fff',
        }}
      >
        {snackbarState.message}
      </Alert>
    </Snackbar>
  );
});

export const successSnackbar = (message, ref) => {
  if (ref.current) {
    ref.current.openSnackbar(message, 'success');
  }
};

export const errorSnackbar = (message, ref) => {
  if (ref.current) {
    ref.current.openSnackbar(message, 'error');
  }
};

export default CustomSnackbar;
