import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Divider, Autocomplete, TextField, Table, TableBody, TableCell, TableHead, TableRow, Box, Typography, Paper, IconButton, TableContainer, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Delete, AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { getAllItems } from '../../Service/Item.api';
import { addBill } from '../../Service/Bill.api';
import { useNavigate } from 'react-router-dom';
import CustomSnackbar, { successSnackbar, errorSnackbar } from '../../Common/Snackbar';
import { getCustomerByPhoneNumber } from '../../Service/Customer.api';

const AddBill = () => {
  const navigate = useNavigate();
  const snackbarRef = useRef();
  const [cart, setCart] = useState([{ item: null, quantity: 1, stockQuantity: 0, rate: 0, tax: 0, total: 0 }]);
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState(''); 
  const [phoneError, setPhoneError] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const decimalUnits = ['kg', 'L', 'm', 'ft', 'sq ft', 'sq m', 'cu ft', 'gal', 'lb', 'oz'];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await getAllItems();
    setItems(response);
  };

  const handleItemSelect = (index, item) => {
    const newCart = [...cart];
    if (item === null) {
      if (newCart.length > 1) {
        newCart.splice(index, 1);
      } else {
        newCart[index] = { item: null, quantity: 1, rate: 0, tax: 0, total: 0 };
      }
      setCart(newCart);
      return;
    }

    const existingItemIndex = newCart.findIndex(cartItem => cartItem.item?.id === item.id);

    if (existingItemIndex > -1 && existingItemIndex !== index) {
      newCart[existingItemIndex].quantity += 1;
      newCart[existingItemIndex].total = newCart[existingItemIndex].rate * newCart[existingItemIndex].quantity;

      if (newCart.length > 1) {
        newCart.splice(index, 1);
      }
    } else {
      newCart[index] = {
        item,
        quantity: 1,
        stockQuantity: item.stockQuantity,
        rate: item.sellingPrice,
        tax: item.tax || 0,
        total: item.sellingPrice,
      };
    }
    if (newCart.length === 0 || newCart[newCart.length - 1].item !== null) {
      newCart.push({ item: null, quantity: 1, rate: 0, tax: 0, total: 0 });
    }
    setCart(newCart);
  };

  const handleQuantityChange = (index, delta) => {
    const newCart = [...cart];
    const itemUnit = newCart[index].item?.unit;
    const isDecimalAllowed = decimalUnits.includes(itemUnit);
  
    const stepValue = isDecimalAllowed ? 0.1 : 1;
  
    const updatedQuantity = isDecimalAllowed
      ? parseFloat((newCart[index].quantity + delta * stepValue).toFixed(2))
      : newCart[index].quantity + delta * stepValue;
  
    if (updatedQuantity > 0) {
      newCart[index].quantity = updatedQuantity;
      newCart[index].total = newCart[index].rate * updatedQuantity;
      setCart(newCart);
    }
  };

  const handleQuantityInputChange = (index, value) => {
    const newCart = [...cart];
    const itemUnit = newCart[index].item?.unit;
    const isDecimalAllowed = decimalUnits.includes(itemUnit);
  
    if (isDecimalAllowed ? /^[0-9]*[.]?[0-9]*$/.test(value) : /^[0-9]*$/.test(value)) {
      newCart[index].quantity = value;
      newCart[index].total = newCart[index].rate * (parseFloat(value) || 0);
      setCart(newCart);
    }
  };

  const handleRemoveItem = (index) => {
    if (cart.length > 1) {
      const newCart = cart.filter((_, i) => i !== index);
      setCart(newCart);
    } else {
      const newCart = [...cart];
      newCart[0] = { item: null, quantity: 1, rate: 0, tax: 0, total: 0 };
      setCart(newCart);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.total + (item.total * item.tax / 100)), 0);
  const discountInAmount = (totalAmount * discountPercentage) / 100;
  const finalAmount = totalAmount - discountInAmount;

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setCustomerPhoneNumber(value);
  
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  };


  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    if (!/^\d+$/.test(customerPhoneNumber)) {
      setPhoneError("Phone number must be a number.");
    }
  };

    useEffect(() => {
      if (customerPhoneNumber.length === 10 && /^\d+$/.test(customerPhoneNumber)) {
        setPhoneError('');
        const timer = setTimeout(async () => {
          try {
            const customer = await getCustomerByPhoneNumber(customerPhoneNumber);
            if (customer?.error) {
              successSnackbar("Customer doesn't exist!", snackbarRef);
            } else if (customer && Object.keys(customer).length > 0) {
              setCustomerName(customer.customerName || customerName);
              setCustomerEmail(customer.customerEmail || customerEmail);
              setCustomerAddress(customer.customerAddress || customerAddress);
              successSnackbar('Customer exists!', snackbarRef);
            }
          } catch (error) {
            console.error('Error fetching customer by phone number:', error);
            errorSnackbar('Error fetching customer information', snackbarRef);
          }
        }, 1);
  
        return () => clearTimeout(timer);
      } else if (customerPhoneNumber.length > 0) {
        setPhoneError('Phone number must be exactly 10 digits.');
      }
    }, [customerPhoneNumber]);
  

  const handleProceedToPayment = async () => {

    // if (phoneError) {
    //   errorSnackbar("Please fix the errors before proceeding to payment", snackbarRef);
    //   return;
    // }

    // if (!customerName) {
    //   errorSnackbar('Customer name is required', snackbarRef);
    //   return;
    // } else if (!customerPhoneNumber) {
    //   errorSnackbar('Customer number is required', snackbarRef);
    //   return;
    // } else if (!customerAddress) {
    //   errorSnackbar('Customer address is required', snackbarRef);
    //   return;
    // } else if (!paymentMethod) {
    //   errorSnackbar('Payment method is required', snackbarRef);
    //   return;
    // }

    const payload = {
      total: totalAmount,
      discountPercentage,
      discountAmount: discountInAmount,
      billingAmount: finalAmount,
      paymentMethod,
      paymentStatus: "success",
      returned: false,
      parentBillId: null,
      customerName,
      customerAddress,
      customerPhoneNumber: customerPhoneNumber || "",
      cartBucketDtos: cart
        .filter(item => item.item)
        .map(item => ({
          quantity: item.quantity,
          itemId: item.item.id,
        })),
    };

    try {
      await addBill(payload);
      successSnackbar('Payment went through', snackbarRef);
      navigate('/bill');
    } catch (error) {
      console.error('Error adding bill:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', padding: '40px', gap: 4, flexWrap: 'wrap' }}>
      <Paper sx={{ flex: '3', padding: 4, backgroundColor: '#f9f9f9', boxShadow: 3, borderRadius: 4 }}>
      <TableContainer sx={{ marginTop: 4 }}>
        <Table stickyHeader sx={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f1f1' }}>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150, width: '30%' }}>Item Details</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 100, width: '15%' }}>Stock Qty</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 100, width: '15%', paddingLeft: '30px' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 100, width: '15%' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 100, width: '15%' }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 100, width: '10%' }}>Delete Item</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((cartItem, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Autocomplete
                    options={items}
                    getOptionLabel={(option) => `${option.name} - ₹${option.sellingPrice}`}
                    value={cartItem.item}
                    disableClearable
                    onChange={(event, value) => handleItemSelect(index, value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={cartItem.item ? '' : 'Select Product'}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          sx: {
                            height: '40px',
                            padding: '0 12px',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                          },
                        }}
                        InputLabelProps={{
                          sx: {
                            fontSize: '0.75rem',
                            lineHeight: '1.1',
                            top: '-2px',
                          },
                        }}
                      />
                    )}
                  />
                </TableCell>
                <TableCell>{cartItem.stockQuantity}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      // alignItems: 'center',
                      // justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    <IconButton onClick={() => handleQuantityChange(index, -1)} size="small">
                      <RemoveCircleOutline fontSize="small" />
                    </IconButton>

                    <TextField
                      value={cart[index].quantity || ""}
                      onChange={(e) => handleQuantityInputChange(index, e.target.value)}
                      type="text"
                      inputProps={{
                        inputMode: "decimal",
                        min: "0",
                        // step: decimalUnits.includes(cart[index].item?.unit) ? "0.1" : "1",
                        style: { textAlign: 'center' },
                      }}
                      sx={{
                        width: "80px",
                        '& input': {
                          padding: '4px 0',
                        },
                      }}
                    />

                    <IconButton onClick={() => handleQuantityChange(index, 1)} size="small">
                      <AddCircleOutline fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>₹{cartItem.rate}</TableCell>
                <TableCell>₹{cartItem.total}</TableCell>
                <TableCell>
                  {cart.length > 1 && cartItem.item && (
                    <IconButton onClick={() => handleRemoveItem(index)}>
                      <Delete />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

        <Box sx={{ marginTop: 4, padding: 2, borderRadius: 2, backgroundColor: '#ffffff', width: '40%', marginLeft: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            <Typography>Subtotal:</Typography>
            <Typography sx={{ marginBottom: 1 }}>₹{totalAmount.toFixed(2)}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            <Typography>Discount:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label="Discount (%)"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
                type="number"
                sx={{ width: '80px', marginRight: '30px' }}
                InputProps={{
                  sx: {
                    height: '30px',
                    fontSize: '0.875rem',
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontSize: '0.75rem',
                  },
                }}
              />
              <Typography>₹{discountInAmount.toFixed(2)}</Typography>
            </Box>
          </Box>

          <Divider
            sx={{
              width: '100%',
              margin: '20px auto',
              borderBottomWidth: '2px',
              borderColor: 'rgba(0, 0, 0, 0.2)',
              animation: 'slideIn 0.5s ease',
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Final Total:</Typography>
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₹{finalAmount.toFixed(2)}</Typography>
          </Box>
        </Box>

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
          `}
        </style>
      </Paper>

      <Paper sx={{ 
        flex: '1', 
        padding: 4, 
        backgroundColor: '#f9f9f9', 
        boxShadow: 3, 
        borderRadius: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2, 
        alignItems: 'center'
    }}>
      <Typography variant="h6" sx={{ 
        fontWeight: 'bold', 
        marginBottom: 2, 
        color: '#333' 
      }}>
        Customer Information
      </Typography>

      <TextField
        label="Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        fullWidth
        required
        sx={{
          marginBottom: 2,
          '& .MuiInputBase-root': {
            backgroundColor: '#fff', 
            borderRadius: 2,
          },
        }}
      />

      <TextField
        label="Phone Number"
        value={customerPhoneNumber}
        onChange={handlePhoneNumberChange}
        onBlur={handlePhoneBlur}
        required
        fullWidth
        sx={{
          marginBottom: 2,
          '& .MuiInputBase-root': {
            backgroundColor: '#fff',
            borderRadius: 2,
          },
        }}
        error={phoneTouched && !!phoneError}
        helperText={phoneTouched && phoneError}
      />

      <TextField
        label="Email"
        value={customerEmail}
        onChange={(e) => setCustomerEmail(e.target.value)}
        fullWidth
        sx={{
          marginBottom: 2,
          '& .MuiInputBase-root': {
            backgroundColor: '#fff', 
            borderRadius: 2,
          },
        }}
      />

      <TextField
        label="Address"
        value={customerAddress}
        onChange={(e) => setCustomerAddress(e.target.value)}
        fullWidth
        required
        sx={{
          marginBottom: 2,
          '& .MuiInputBase-root': {
            backgroundColor: '#fff', 
            borderRadius: 2,
          },
        }}
      />

      <FormControl fullWidth required sx={{ marginBottom: 2 }}>
        <InputLabel>Payment Method</InputLabel>
        <Select
          label="Payment Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          fullWidth
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: '#fff',
              borderRadius: 2,
            },
          }}
        >
          <MenuItem value="cash">Cash</MenuItem>
          <MenuItem value="upi">UPI</MenuItem>
          <MenuItem value="credit">Credit</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleProceedToPayment}
        disabled={
          !cart.some((cartItem) => cartItem.item !== null) || !customerName.trim() || !customerPhoneNumber.trim() || phoneError || !customerAddress.trim() || !paymentMethod
        }
        fullWidth
        sx={{
          padding: '12px 0', 
          fontSize: '1rem', 
          fontWeight: 'bold', 
          borderRadius: 2, 
          backgroundColor: '#1976d2', 
          '&:hover': { backgroundColor: '#1565c0' }, 
        }}
      >
        Proceed to Payment
      </Button>
    </Paper>
        <CustomSnackbar ref={snackbarRef}/>
    </Box>
  );
};

export default AddBill;
