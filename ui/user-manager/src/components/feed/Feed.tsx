import {
  Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress,
} from '@mui/material';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import Button from '@mui/material/Button';
import FeedEntry from './FeedEntry';
import AddAnnouncement from '../form/AddAnnouncement';
import { RootState } from '../../store';
import { Announcement } from '../../generated-sources/openapi';
import { getAdminAPI, getPublicAPI } from '../../api/api';

export default function Feed() {
  const isAdmin = useSelector((state: RootState) => state.user.isAdmin);
  const user = useSelector((state: RootState) => state.user);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteAnnouncementTitle, setDeleteAnnouncementTitle] = useState('');
  const [deleteAnnouncementId, setDeleteAnnouncementId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feeds, setFeeds] = useState<Array<Announcement>>([{
    id: 'default-announce',
    title: 'Welcome to Holy Family Syro Malabar Church!',
    subtitle: '',
    description: ' Please register and become a part of our community.',
    createdOn: '',
    expiresOn: '',
  }]);

  const onDelete = (title:string, announcementId:string) => {
    setDeleteAnnouncementTitle(title);
    setDeleteAnnouncementId(announcementId);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  const loadAnnouncements = () => {
    setIsLoading(true);
    getPublicAPI().getAnnouncements()
      .then((announcements: AxiosResponse<Array<Announcement>>) => {
        if (announcements.data.length > 0) {
          setFeeds(announcements.data);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const deleteAnnouncement = async () => {
    console.log(deleteAnnouncementId);
    closeConfirmDialog();
    if (!isAdmin || !user.isLoggedIn) {
      return;
    }
    await getAdminAPI(user.accessToken)
      .deleteAnnouncements([deleteAnnouncementId])
      .then(() => loadAnnouncements());
  };

  useEffect(() => {
    loadAnnouncements();
  }, [isAdmin]);

  return (
    <Box height="85vh" flex={4} p={2}>
      <Dialog
        open={confirmDialogOpen}
        onClose={closeConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`This will remove ${deleteAnnouncementTitle}. Continue?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>No</Button>
          <Button onClick={deleteAnnouncement} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      {isAdmin && <AddAnnouncement setFeeds={setFeeds} setLoading={setIsLoading} />}
      {isLoading && <LinearProgress />}
      {
        feeds.map((announcement) => <FeedEntry key={announcement.id} announcement={announcement} isAdmin={isAdmin} onDelete={onDelete} />)
      }
    </Box>
  );
}
