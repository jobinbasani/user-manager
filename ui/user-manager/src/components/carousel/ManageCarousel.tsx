import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { CardMedia } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import AddCarouselItem, { AddCarouselProps } from '../form/AddCarouselItem';
import { getPublicAPI } from '../../api/api';
import { CarouselItem } from '../../generated-sources/openapi';

function CarouselSlide({
  subtitle,
  title,
  url,
}: CarouselItem) {
  return (
    <Card sx={{ maxHeight: 400 }}>
      <CardMedia
        sx={{ height: 400 }}
        image={url}
      />
      <CardContent>
        {title && title.length > 0
        && (
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
        )}
        {subtitle && subtitle.length > 0
        && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
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
      {user.isAdmin ? <AddCarouselItem user={user} /> : null}
      {carouselItems.length > 0
      && (
        <Card sx={{ margin: 0 }}>
          <Carousel>
            {
              carouselItems.map((item) => <CarouselSlide key={item.id} url={item.url} title={item.title} subtitle={item.subtitle} />)
            }
          </Carousel>
        </Card>
      )}
    </>
  );
}
