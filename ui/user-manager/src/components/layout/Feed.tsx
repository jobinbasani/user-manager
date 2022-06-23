import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import FeedEntry from '../feed/FeedEntry';
import AddAnnouncement from '../form/AddAnnouncement';
import { RootState } from '../../store';
import { Announcement } from '../../generated-sources/openapi';
import { getPublicAPI } from '../../api/api';

export default function Feed() {
  const isAdmin = useSelector((state: RootState) => state.user.isAdmin);
  const [feeds, setFeeds] = useState<Array<Announcement>>([{
    id: 'default-announce',
    title: 'Welcome to Holy Family Syro Malabar Church!',
    subtitle: '',
    description: ' Please register and become a part of our community!',
    createdOn: '',
    expiresOn: '',
  }]);

  useEffect(() => {
    getPublicAPI().getAnnouncements()
      .then((announcements: AxiosResponse<Array<Announcement>>) => {
        if (announcements.data.length > 0) {
          setFeeds(announcements.data);
        }
      });
  }, [isAdmin]);

  return (
    <Box bgcolor="grey" flex={4} p={2}>
      {isAdmin && <AddAnnouncement setFeeds={setFeeds} />}
      {
        feeds.map((announcement) => <FeedEntry announcement={announcement} />)
      }
    </Box>
  );
}
