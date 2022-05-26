import { Box } from '@mui/material';
import ContactCard from '../contact/ContactCard';

export default function Rightbar() {
  return (
    <Box flex={2} p={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
      <Box position="fixed">
        <ContactCard />
      </Box>
    </Box>
  );
}
