import React, { useState, useRef } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { saveStoreDetails } from '../Service/StoreDetails.api';
import CustomSnackbar, {successSnackbar, errorSnackbar} from '../Common/Snackbar';

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

const Settings = () => {
  const snackbarRef = useRef();
  const [orgName, setOrgName] = useState('');
  const [orgNo, setOrgNo] = useState('');
  const [orgAddress, setOrgAddress] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    const data = new FormData();
    data.append('name', orgName);
    data.append('phoneNumber', orgNo);
    data.append('address', orgAddress);
    data.append('logo', logo);
  
    try {
      const response = await saveStoreDetails(data);
      console.log(response);
      successSnackbar("Store details saved!");
    } catch (error) {
      successSnackbar("Error saving store details");
      console.log(error);
      throw error;
    }
  };
  

  return (
    <StyledCard>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
        Settings
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
          fullWidth
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />

        <StyledTextField
          label="Organization Number*"
          variant="outlined"
          fullWidth
          value={orgNo}
          onChange={(e) => setOrgNo(e.target.value)}
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
          Save
        </StyledButton>
      </CardContent>
      <CustomSnackbar ref={snackbarRef}/>
    </StyledCard>
  );
};

export default Settings;
