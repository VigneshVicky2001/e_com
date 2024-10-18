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

  // Expose openSnackbar to the parent via ref
  useImperativeHandle(ref, () => ({
    openSnackbar(message, severity) {
      setSnackbarState({
        open: true,
        message,
        severity,
      });
    },
  }));

  // Close Snackbar on click or after autoHideDuration
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarState((prev) => ({ ...prev, open: false }));

    // Reset the snackbar state after a brief delay to avoid flickering
    setTimeout(() => {
      setSnackbarState({
        open: false,
        message: '',
        severity: 'success',
      });
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

  const slideTransition = (props) => <Slide {...props} direction="down" />;

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
  if (ref && ref.current) {
    console.log('Snackbar opened with success:', message); // Debugging log
    ref.current.openSnackbar(message, 'success');
  } else {
    console.error("Snackbar ref is undefined or not passed correctly."); // Error handling
  }
};

export const errorSnackbar = (message, ref) => {
  if (ref && ref.current) {
    console.log('Snackbar opened with error:', message); // Debugging log
    ref.current.openSnackbar(message, 'error');
  } else {
    console.error("Snackbar ref is undefined or not passed correctly."); // Error handling
  }
};

export default CustomSnackbar;
