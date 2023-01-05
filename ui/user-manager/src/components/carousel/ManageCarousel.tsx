import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, CardMedia } from '@mui/material';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';
import AddCarouselItem, { AddCarouselProps } from '../form/AddCarouselItem';
import { getAdminAPI, getPublicAPI } from '../../api/api';
import { CarouselItem } from '../../generated-sources/openapi';
import { UserDetails } from '../../store/user/user-slice';

type CarouselSlideProps = CarouselItem & {
  user: UserDetails
  loader: () => void
}

function deleteCarouselImage(user:UserDetails, id:string, loader:(() => void)) {
  getAdminAPI(user.accessToken).deleteCarouselItem(id)
    .then((delResp) => {
      if (delResp.status >= 200 && delResp.status < 300) {
        loader();
      }
    });
}
function CarouselSlide({
  id,
  subtitle,
  title,
  url,
  user,
  loader,
}: CarouselSlideProps) {
  return (
    <Card sx={{ maxHeight: 400 }}>
      <CardMedia
        sx={{ height: 400 }}
        image={url}
      />
      {((user.isAdmin) || (title && title.length > 0) || (subtitle && subtitle.length > 0))
      && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.35)',
            color: 'white',
            padding: '10px',
          }}
        >
          {title && title?.length > 0
            && <Typography variant="h5">{title}</Typography>}
          {subtitle && subtitle.length > 0
          && <Typography variant="body2">{subtitle}</Typography>}
          {user.isAdmin
          && (
            <Button variant="outlined" startIcon={<DeleteForeverIcon />} onClick={() => { deleteCarouselImage(user, id, loader); }}>
              Delete
            </Button>
          )}
        </Box>
      )}
    </Card>
  );
}
export default function ManageCarousel({ user }:AddCarouselProps) {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const loadCarousel = () => {
    getPublicAPI().getCarouselItems()
      .then((itemsResp) => {
        setCarouselItems(itemsResp.data);
      });
  };

  useEffect(() => {
    loadCarousel();
  }, [user]);

  return (
    <>
      {carouselItems.length > 0
      && (
        <Card sx={{ margin: 0 }}>
          <Carousel>
            {
              carouselItems.map((item) => (
                <CarouselSlide
                  key={item.id}
                  id={item.id}
                  user={user}
                  url={item.url}
                  title={item.title}
                  subtitle={item.subtitle}
                  loader={loadCarousel}
                />
              ))
            }
          </Carousel>
        </Card>
      )}
      {user.isAdmin ? <AddCarouselItem user={user} /> : null}
    </>
  );
}
