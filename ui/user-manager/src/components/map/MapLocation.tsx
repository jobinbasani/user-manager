import GoogleMapReact from 'google-map-react';
import { Link, Stack } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import FestivalIcon from '@mui/icons-material/Festival';
import PlaceIcon from '@mui/icons-material/Place';
import Card from '@mui/material/Card';
import React from 'react';
import AddLocation, { AddLocationProps } from '../form/AddLocation';

type LocationProps = AddLocationProps & {
  isAdmin: boolean,
}

export default function MapLocation({
  isAdmin, location, setLocation, setLoading,
}:LocationProps) {
  return (
    <>
      {isAdmin && <AddLocation location={location} setLocation={setLocation} setLoading={setLoading} />}
      {location.apiKey && location.apiKey.length > 0
      && (
        <Card sx={{ margin: 5 }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" component="div">
                Join us here!
              </Typography>
              <FestivalIcon color="primary" />
            </Stack>
            <div style={{ height: '50vh', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: location.apiKey }}
                defaultCenter={{ lat: 44.571226, lng: -63.5656687 }}
                center={{ lat: location.latitude, lng: location.longitude }}
                defaultZoom={15}
              >
                {location.address
                  && (
                    <Stack>
                      <PlaceIcon color="primary" />
                      <br />
                      {location.url.length > 0
                        ? <Link target="_blank" href={location.url}>{location.address}</Link>
                        : <p className="pin-text">{location.address}</p>}
                    </Stack>
                  )}
              </GoogleMapReact>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
