import React, { useEffect, useState } from 'react';
import { Image } from 'react-grid-gallery';
import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { AlertColor } from '@mui/material';
import ImageGallery from '../images/ImageGallery';
import { AdminProps } from '../../pages/private/Admin';
import { getAdminAPI } from '../../api/api';
import StackContainer from '../layout/StackContainer';
import ImagePicker from '../common/ImagePicker';
import ConfirmMessage from '../common/ConfirmMessage';
import { BackgroundImageItem } from '../../generated-sources/openapi';
import InfoBar from '../common/InfoBar';

export default function ManageBackgroundImages({ user }: AdminProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [imageToUpload, setImageToUpload] = useState<File>();
  const [canDelete, setCanDelete] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [infoBarOpen, setInfoBarOpen] = useState(false);
  const [infoBarMessage, setInfoBarMessage] = useState('');
  const [infoBarSeverity, setInfoBarSeverity] = useState<AlertColor>('success');
  const loadImages = () => {
    getAdminAPI(user.accessToken).getBackgroundImages()
      .then((itemsResp) => setImages(itemsResp.data.map((bg) => bg as Image)));
  };

  const onImageUploadSelection = (file:File|undefined) => {
    setImageToUpload(file);
  };

  const addNewImage = () => {
    getAdminAPI(user.accessToken)
      .addBackgroundImage(imageToUpload)
      .then((resp) => {
        if (resp.status >= 200 && resp.status < 300) {
          setInfoBarMessage('Image uploaded successfully!');
          setInfoBarSeverity('success');
          setInfoBarOpen(true);
        } else {
          setInfoBarMessage('Failed to upload image');
          setInfoBarSeverity('error');
          setInfoBarOpen(true);
        }
      })
      .finally(() => {
        setImageToUpload(undefined);
        loadImages();
      });
  };

  const deleteImages = () => {
    setConfirmDialogOpen(false);
    const deleteRequests = images.filter((im) => im.isSelected === true)
      .map((im) => im as BackgroundImageItem)
      .map((im) => getAdminAPI(user.accessToken).deleteBackgroundImage(im.id));
    if (deleteRequests.length === 0) {
      return;
    }
    Promise.all(deleteRequests)
      .then((resp) => {
        const failedRequests = resp.filter((r) => r.status >= 400);
        if (failedRequests.length === 0) {
          setInfoBarMessage('Image deleted successfully!');
          setInfoBarSeverity('success');
          setInfoBarOpen(true);
        } else {
          setInfoBarMessage('Failed to delete some images');
          setInfoBarSeverity('error');
          setInfoBarOpen(true);
        }
      })
      .finally(() => {
        loadImages();
      });
  };

  useEffect(() => {
    loadImages();
  }, [user]);

  useEffect(() => {
    const selectedImages = images.filter((im) => im.isSelected && im.isSelected === true);
    setCanDelete(selectedImages.length > 0);
  }, [images]);

  return (
    <StackContainer>
      {images.length > 0
        && (
          <>
            <ConfirmMessage
              isOpen={confirmDialogOpen}
              onClose={() => { setConfirmDialogOpen(false); }}
              onConfirm={() => { deleteImages(); }}
              message="Delete selected images?"
            />
            <ImageGallery images={images} onSelect={setImages} />
            <Button
              variant="contained"
              color="primary"
              startIcon={<DeleteForeverIcon />}
              disabled={!canDelete}
              onClick={() => { setConfirmDialogOpen(true); }}
            >
              Delete Selected
            </Button>
          </>
        )}
      <ImagePicker selectedFile={imageToUpload} selectionHandler={onImageUploadSelection} uploadLabel="Add New Image" />
      <br />
      <br />
      <Button
        variant="contained"
        color="primary"
        disabled={imageToUpload === undefined}
        onClick={addNewImage}
      >
        Upload
      </Button>
      <br />
      <br />
      <InfoBar isOpen={infoBarOpen} onClose={() => { setInfoBarOpen(false); }} message={infoBarMessage} severity={infoBarSeverity} />
    </StackContainer>
  );
}
