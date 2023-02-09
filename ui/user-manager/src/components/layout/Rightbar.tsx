import { Box, styled } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ContactCard from '../contact/ContactCard';

styled(Box)(({ theme }) => ({
  position: 'static',
  [theme.breakpoints.up('sm')]: {
    position: 'fixed',
  },
}));
export default function Rightbar() {
  return (
    <Box flex={2} p={2}>
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <ContactCard />
        </CardContent>
      </Card>
    </Box>
  );
}
