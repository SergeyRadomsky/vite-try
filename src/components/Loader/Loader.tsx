// components/Loader/Loader.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, Typography, Box } from '@mui/material';
import { RootState } from '../../store/store';
import { SelectIsLoadingLoader, selectLoadingError } from '../../store/Loader/selector';

const Loader: React.FC = () => {
  const isLoading = useSelector((state: RootState) => SelectIsLoadingLoader(state));
  const error = useSelector((state: RootState) => selectLoadingError(state));

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return null;
};

export default Loader;
