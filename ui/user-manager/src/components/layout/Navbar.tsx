import {
  AppBar, Avatar, Box, styled, Toolbar,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import ChurchIcon from '@mui/icons-material/Church';
import { useSelector } from 'react-redux';
import { UserDetails } from '../../store/user/user-slice';
import { RootState } from '../../store';
import { stringAvatar } from '../../util/util';

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
  const user:UserDetails = useSelector((state: RootState) => state.user);

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <ChurchIcon />
        <Box sx={{ flexGrow: 1, paddingLeft: 2 }}>
          <Typography variant="h6">
            Holy Family Catholic Church
          </Typography>
        </Box>
        {user?.isLoggedIn
          && (
            <UserInfo>
              <Typography sx={{
                display: {
                  xs: 'none',
                  sm: 'block',
                },
              }}
              >
                {`${user?.userInfo.firstName} ${user?.userInfo.lastName}`}
              </Typography>
              <Avatar {...stringAvatar(`${user?.userInfo.firstName} ${user?.userInfo.lastName}`)} />
            </UserInfo>
          )}
      </StyledToolbar>
    </AppBar>
  );
}
