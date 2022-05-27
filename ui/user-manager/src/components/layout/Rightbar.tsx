import { Box, styled } from '@mui/material';
import ContactCard from '../contact/ContactCard';

const RightbarBox = styled(Box)(({ theme }) => ({
  position: 'static',
  [theme.breakpoints.up('sm')]: {
    position: 'fixed',
  },
}));

export default function Rightbar() {
  return (
    <Box flex={2} p={2}>
      <RightbarBox>
        <ContactCard />
      </RightbarBox>
    </Box>
  );
}
