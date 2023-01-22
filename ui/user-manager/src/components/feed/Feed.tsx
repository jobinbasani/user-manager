import {
  Box, LinearProgress,
} from '@mui/material';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import FeedEntry from './FeedEntry';
import AddAnnouncement from '../form/AddAnnouncement';
import { RootState } from '../../store';
import { Announcement, Location } from '../../generated-sources/openapi';
import { getAdminAPI, getPublicAPI } from '../../api/api';
import MapLocation from '../map/MapLocation';
import ManageCarousel from '../carousel/ManageCarousel';
import ConfirmMessage from '../common/ConfirmMessage';
import MessageCard from '../common/MessageCard';

export default function Feed() {
  const isAdmin = useSelector((state: RootState) => state.user.isAdmin);
  const user = useSelector((state: RootState) => state.user);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteAnnouncementTitle, setDeleteAnnouncementTitle] = useState('');
  const [deleteAnnouncementId, setDeleteAnnouncementId] = useState('');
  const [location, setLocation] = useState<Location>({
    address: '',
    apiKey: '',
    latitude: 0,
    longitude: 0,
    url: '',
  });
  const [isLocationLoading, setIsLocationLoading] = useState(false);
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

  const loadLocation = () => {
    setIsLocationLoading(true);
    getPublicAPI().getLocation()
      .then((locationResponse: AxiosResponse<Location>) => {
        setLocation(locationResponse.data);
      })
      .finally(() => setIsLocationLoading(false));
  };

  const deleteAnnouncement = async () => {
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

  useEffect(() => {
    loadLocation();
  }, [isAdmin]);

  return (
    <Box height="85vh" flex={4} p={2}>
      <ManageCarousel user={user} />

      <ConfirmMessage
        isOpen={confirmDialogOpen}
        onClose={closeConfirmDialog}
        onConfirm={deleteAnnouncement}
        message={`This will remove ${deleteAnnouncementTitle}. Continue?`}
      />

      {isAdmin && <AddAnnouncement setFeeds={setFeeds} setLoading={setIsLoading} />}
      {isLoading && <LinearProgress />}
      {
        feeds.map((announcement) => <FeedEntry key={announcement.id} announcement={announcement} isAdmin={isAdmin} onDelete={onDelete} />)
      }
      {isLocationLoading && <LinearProgress />}
      <MapLocation location={location} setLocation={setLocation} setLoading={setIsLocationLoading} isAdmin={isAdmin} />
      <MessageCard
        headerImage="https://images.unsplash.com/photo-1594857373854-0314626c18e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
        title="Title gors here"
        subtitle1="Subtitle"
        subtitle2="Jan 1"
        message="Main message is here"
        showOptions
        onDelete={() => console.log('deleted')}
      />
    </Box>
  );
}
