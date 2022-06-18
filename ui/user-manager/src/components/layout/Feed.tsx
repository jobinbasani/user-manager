import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import FeedEntry from '../feed/FeedEntry';
import AddAnnouncement from '../form/AddAnnouncement';
import { RootState } from '../../store';

export default function Feed() {
  const isAdmin = useSelector((state: RootState) => state.user.isAdmin);
  return (
    <Box bgcolor="grey" flex={4} p={2}>
      {isAdmin && <AddAnnouncement />}
      <FeedEntry />
      <FeedEntry />
      <FeedEntry />
      <FeedEntry />
      <FeedEntry />
      <FeedEntry />
      <FeedEntry />
    </Box>
  );
}
