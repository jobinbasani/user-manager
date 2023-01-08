import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { AlertColor, Box, CardMedia } from '@mui/material';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';
import AddCarouselItem from '../form/AddCarouselItem';
import { getAdminAPI, getPublicAPI } from '../../api/api';
import { CarouselItem } from '../../generated-sources/openapi';
import { UserDetails } from '../../store/user/user-slice';
import ConfirmMessage from '../common/ConfirmMessage';
import InfoBar from '../common/InfoBar';

type ManageCarouselProps = {
  user: UserDetails
}

type CarouselSlideProps = ManageCarouselProps & CarouselItem & {
  deletionHandler: (id:string)=>void
}

function CarouselSlide({
  id,
  subtitle,
  title,
  url,
  user,
  deletionHandler,
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
            <Button variant="contained" startIcon={<DeleteForeverIcon />} onClick={() => { deletionHandler(id); }}>
              Delete
            </Button>
          )}
        </Box>
      )}
    </Card>
  );
}
export default function ManageCarousel({ user }:ManageCarouselProps) {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [infoBarOpen, setInfoBarOpen] = useState(false);
  const [infoBarMessage, setInfoBarMessage] = useState('');
  const [infoBarSeverity, setInfoBarSeverity] = useState<AlertColor>('success');
  const [idToDelete, setIdToDelete] = useState('');
  const loadCarousel = () => {
    getPublicAPI().getCarouselItems()
      .then((itemsResp) => {
        setCarouselItems(itemsResp.data);
      });
  };

  const confirmImageDeletion = (id:string) => {
    setIdToDelete(id);
    setConfirmDialogOpen(true);
  };
  const deleteImage = () => {
    setConfirmDialogOpen(false);
    getAdminAPI(user.accessToken).deleteCarouselItem(idToDelete)
      .then((delResp) => {
        if (delResp.status >= 200 && delResp.status < 300) {
          setInfoBarMessage('Image deleted successfully!');
          setInfoBarSeverity('success');
          setInfoBarOpen(true);
          loadCarousel();
        } else {
          setInfoBarMessage('Failed to delete image');
          setInfoBarSeverity('error');
          setInfoBarOpen(true);
        }
      });
  };

  const setInfoBarValues = (severity:AlertColor, message:string, isOpen?:boolean) => {
    setInfoBarMessage(message);
    setInfoBarSeverity(severity);
    setInfoBarOpen(isOpen || true);
  };
  const addCarouselItem = async (setSubmitting:((isSubmitting: boolean) => void), image: any, title?: string, subtitle?: string) => {
    await getAdminAPI(user.accessToken).addCarouselItem(image, title, subtitle)
      .then((resp) => {
        if (resp.status >= 200 && resp.status < 300) {
          setInfoBarValues('success', 'Image added successfully!');
          loadCarousel();
        } else {
          setInfoBarValues('error', 'Failed to add image');
          setInfoBarOpen(true);
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  useEffect(() => {
    loadCarousel();
  }, [user]);

  return (
    <>
      <ConfirmMessage
        isOpen={confirmDialogOpen}
        onClose={() => { setConfirmDialogOpen(false); }}
        onConfirm={() => { deleteImage(); }}
        message="Delete image?"
      />
      <InfoBar isOpen={infoBarOpen} onClose={() => { setInfoBarOpen(false); }} message={infoBarMessage} severity={infoBarSeverity} />
      {carouselItems.length > 0
      && (
        <Card sx={{ margin: 0 }}>
          <Carousel navButtonsAlwaysVisible autoPlay>
            {
              carouselItems.map((item) => (
                <CarouselSlide
                  key={item.id}
                  id={item.id}
                  user={user}
                  url={item.url}
                  title={item.title}
                  subtitle={item.subtitle}
                  deletionHandler={confirmImageDeletion}
                />
              ))
            }
          </Carousel>
        </Card>
      )}
      {user.isAdmin ? <AddCarouselItem onAddImage={addCarouselItem} /> : null}
    </>
  );
}
