import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { saveStoreDetails, getStoreDetailsById, updateStoreDetails } from '../Service/StoreDetails.api';
import CustomSnackbar, { successSnackbar, errorSnackbar } from '../Common/Snackbar';

const StyledCard = styled(Card)({
  maxWidth: 500,
  margin: '40px auto',
  padding: '20px',
  textAlign: 'center',
  borderRadius: '16px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
});

const AvatarWrapper = styled('label')({
  position: 'relative',
  display: 'inline-block',
  cursor: 'pointer',
  '&:hover .overlay': {
    opacity: 1,
  },
});

const AvatarStyled = styled(Avatar)({
  width: 100,
  height: 100,
  borderRadius: 0,
  border: '2px solid',
  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
});

const Overlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 0,
  opacity: 0,
  transition: 'opacity 0.3s ease',
});

const StyledTextField = styled(TextField)({
  marginBottom: '16px',
  '.MuiOutlinedInput-root': {
    borderRadius: '6px',
  },
});

const StyledButton = styled(Button)({
  marginTop: '12px',
  padding: '8px 16px',
  fontSize: '14px',
  borderRadius: '3px',
  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.5)',
});

const Settings = ({ onLogoUpdate }) => {
  const snackbarRef = useRef();
  const [orgName, setOrgName] = useState('');
  const [orgNo, setOrgNo] = useState('');
  const [orgAddress, setOrgAddress] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [id, setId] = useState(1);
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await getStoreDetailsById(id);
        setOrgName(response.storeName);
        setOrgNo(response.storePhoneNumber);
        setOrgAddress(response.storeAddress);

        const byteString = atob(response.storeLogo);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
          uint8Array[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([uint8Array], { type: 'image/png' });
        const file = new File([blob], "store-logo.png", { type: 'image/png' });

        setLogo(file);
        setLogoPreview(`data:image/png;base64,${response.storeLogo}`);
      } catch (error) {
        console.error("Error fetching store details", error);
        errorSnackbar("Error loading store details");
      }
    };

    fetchStoreDetails();
  }, [id]);

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setOrgNo(value);
    if (value.length !== 10 || !/^\d+$/.test(value)) {
      setPhoneError("Phone number must be exactly 10 digits.");
    } else {
      setPhoneError('');
    }
  };

  const handleSaveChanges = async () => {
    if (phoneError) {
      errorSnackbar("Please fix the errors before saving.", snackbarRef);
      return;
    }

    const data = new FormData();
    data.append('id', id);
    data.append('name', orgName);
    data.append('phoneNumber', orgNo);
    data.append('address', orgAddress);
    data.append('logo', logo);

    try {
      const response = await updateStoreDetails(data);
      onLogoUpdate();
      successSnackbar("Store updated saved!", snackbarRef);
    } catch (error) {
      errorSnackbar("Error updating store details", snackbarRef);
      console.log(error);
    }
  };

  return (
    <StyledCard>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
        {id ? "Edit Store Details" : "Add Store Details"}
      </Typography>

      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <AvatarWrapper>
            <AvatarStyled src={logoPreview} alt="Organization Logo" />
            <Overlay className="overlay">
              <PhotoCamera fontSize="medium" />
            </Overlay>
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleLogoChange}
            />
          </AvatarWrapper>
        </Box>

        <StyledTextField
          label="Organization Name*"
          variant="outlined"
          disabled
          fullWidth
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />

        <StyledTextField
          label="Organization Number*"
          variant="outlined"
          fullWidth
          value={orgNo}
          onChange={handlePhoneNumberChange}
          error={!!phoneError}
          helperText={phoneError}
        />

        <StyledTextField
          label="Organization Address*"
          variant="outlined"
          fullWidth
          value={orgAddress}
          onChange={(e) => setOrgAddress(e.target.value)}
        />

        <StyledButton
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
        >
          {id ? "Update" : "Save"}
        </StyledButton>
      </CardContent>
      <CustomSnackbar ref={snackbarRef} />
    </StyledCard>
  );
};

export default Settings;
