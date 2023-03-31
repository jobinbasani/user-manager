import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import React from 'react';
import { RootState } from '../../store';
import ManageCarousel from '../carousel/ManageCarousel';
import PageManager from '../pages/PageManager';

export default function Feed() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <Box height="85vh" flex={4} p={2}>
      <ManageCarousel user={user} />
      <br />
      <PageManager user={user} pageId="homepage" />
      <PageManager user={user} pageId="location" />
    </Box>
  );
}
