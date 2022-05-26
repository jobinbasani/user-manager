import {
  AppBar, Avatar, Box, styled, Toolbar,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import ChurchIcon from '@mui/icons-material/Church';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const UserInfo = styled(Box)(() => ({
  display: 'flex',
  gap: '20px',
  alignItems: 'center',
}));

export default function Navbar() {
  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <ChurchIcon sx={{ display: { xs: 'block', sm: 'none' } }} />
        <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' } }}>
          Holy Family Catholic Church
        </Typography>
        <UserInfo>
          <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>Jobin Basani</Typography>
          <Avatar>JB</Avatar>
        </UserInfo>
      </StyledToolbar>
    </AppBar>
  );
}
