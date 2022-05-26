import { Box } from '@mui/material';
import FeedEntry from '../feed/FeedEntry';

export default function Feed() {
  return (
    <Box bgcolor="grey" flex={4} p={2}>
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
