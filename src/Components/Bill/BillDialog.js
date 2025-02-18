import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogActions, Button, Typography, Divider, Grid } from '@mui/material';
import jsPDF from 'jspdf';

const BillDialog = ({ open, onClose, bill }) => {
  const printRef = useRef();

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text('ABC shop', 105, 10, { align: 'center' });
    doc.setFontSize(12);
    doc.text('address goes here', 105, 20, { align: 'center' });
    doc.text('PH: 2468097513', 105, 26, { align: 'center' });
    doc.text('GSTIN: 123AB456BC789CD', 105, 32, { align: 'center' });
  
    doc.setFontSize(14);
    doc.text('Retail Invoice', 105, 40, { align: 'center' });
    doc.line(10, 50, 200, 50);
  
    doc.setFontSize(12);
    doc.text(`Name: ${bill.customerName}`, 10, 60);
    doc.text(`PH: 5678901234`, 10, 66);
    doc.text(`Bill No: ${bill.Id}`, 150, 60);
    doc.text(`Date: ${formattedDate}`, 150, 66);
    doc.text(`Time: ${formattedTime}`, 150, 72);
  
    doc.line(10, 80, 200, 80);
  
    const finalY = 90;
  
    doc.setFontSize(12);
    doc.text(`Gross Amount: ₹${bill.billingAmount}`, 10, finalY + 10);
    doc.text(`Bill Discount: ${bill.discount}%`, 10, finalY + 16);
    doc.text(`Net Amount: ₹${bill.total}`, 10, finalY + 22);
    doc.text(`Return: ${bill.returned ? 'Yes' : 'No'}`, 10, finalY + 28);
  
    doc.line(10, finalY + 40, 200, finalY + 40);
    doc.text('You have saved: ₹0.00', 105, finalY + 50, { align: 'center' });
  
    doc.save(`Bill_${bill.Id}.pdf`);
  };
  

  if (!bill) return null;

  const formatCurrency = (amount) => `${amount} USD`;
  const formattedDate = new Date(bill.createdDate).toLocaleDateString('en-US');
  const formattedTime = new Date(bill.createdDate).toLocaleTimeString('en-US');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent ref={printRef}>
        <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
          ABC shop
        </Typography>
        <Typography variant="body2" align="center">
          placeholder address value
        </Typography>
        <Typography variant="body2" align="center">
          PH: 2468097513
        </Typography>
        <Typography variant="body2" align="center">
          GSTIN: 123AB456BC789CD
        </Typography>
        <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', mt: 1 }}>
          Retail Invoice
        </Typography>

        <Divider sx={{ width: '100%', margin: '20px auto', borderBottomWidth: '2px', animation: 'slideIn 0.5s ease' }} />

        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography>
              <strong>Name:</strong> {bill.customerName}
            </Typography>
            <Typography>
              <strong>PH:</strong> 5678901234
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography>
              <strong>Bill No:</strong> {bill.Id}
            </Typography>
            <Typography>
              <strong>Date:</strong> {formattedDate}
            </Typography>
            <Typography>
              <strong>Time:</strong> {formattedTime}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ width: '100%', margin: '20px auto', borderBottomWidth: '2px', animation: 'slideIn 0.5s ease' }} />

        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          Summary
        </Typography>
        <Grid container spacing={1} sx={{ textAlign: 'right' }}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
            <Typography sx={{ flex: 1, textAlign: 'left' }}>
              <strong>Total Items:</strong>
            </Typography>
            <Typography>1</Typography>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
            <Typography sx={{ flex: 1, textAlign: 'left' }}>
              <strong>Total Qty:</strong>
            </Typography>
            <Typography>{bill.quantity || 1}</Typography>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
            <Typography sx={{ flex: 1, textAlign: 'left' }}>
              <strong>Gross Amount:</strong>
            </Typography>
            <Typography>₹{bill.billingAmount}</Typography>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
            <Typography sx={{ flex: 1, textAlign: 'left' }}>
              <strong>Bill Discount:</strong>
            </Typography>
            <Typography>{bill.discount}%</Typography>
          </Grid>

          <Divider
            sx={{
              width: '60px',
              borderColor: 'black',
              opacity: '60%',
              animation: 'slideInFromRight 0.3s ease',
              transformOrigin: 'right',
              mb: 2,
              ml: 'auto'
            }}
          />
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography sx={{ flex: 1, textAlign: 'left' }}>
              <strong>Net Amount:</strong>
            </Typography>
            <Typography>₹{bill.total}</Typography>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
            <Typography sx={{ flex: 1, textAlign: 'left' }}>
              <strong>Return:</strong>
            </Typography>
            <Typography>{bill.returned ? 'Yes' : 'No'}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ width: '100%', margin: '20px auto', borderBottomWidth: '2px', animation: 'slideIn 0.5s ease' }} />

        <Typography align="center" sx={{ pt: 2 }}>
          <strong>You have saved:</strong> 0.00
        </Typography>
      </DialogContent>

      <style>
        {`
          @keyframes slideIn {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }
          @keyframes slideInFromRight {
            from {
              width: 0;
            }
            to {
              width: 60px;
            }
          }
        `}
      </style>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleDownloadPDF} color="primary" variant="contained">
          Print Bill
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillDialog;
