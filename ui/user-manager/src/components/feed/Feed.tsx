import {
  Box, LinearProgress,
} from '@mui/material';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { RootState } from '../../store';
import { Location } from '../../generated-sources/openapi';
import { getPublicAPI } from '../../api/api';
import MapLocation from '../map/MapLocation';
import ManageCarousel from '../carousel/ManageCarousel';
import PageManager from '../pages/PageManager';

export default function Feed() {
  const isAdmin = useSelector((state: RootState) => state.user.isAdmin);
  const user = useSelector((state: RootState) => state.user);

  const [location, setLocation] = useState<Location>({
    address: '',
    apiKey: '',
    latitude: 0,
    longitude: 0,
    url: '',
  });
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const loadLocation = () => {
    setIsLocationLoading(true);
    getPublicAPI().getLocation()
      .then((locationResponse) => {
        setLocation(locationResponse.data);
      })
      .finally(() => setIsLocationLoading(false));
  };

  useEffect(() => {
    loadLocation();
  }, [isAdmin]);

  return (
    <Box height="85vh" flex={4} p={2}>
      <ManageCarousel user={user} />
      <br />
      <PageManager user={user} pageId="homepage" />
      {isLocationLoading && <LinearProgress />}
      <MapLocation location={location} setLocation={setLocation} setLoading={setIsLocationLoading} isAdmin={isAdmin} />
    </Box>
  );
}
