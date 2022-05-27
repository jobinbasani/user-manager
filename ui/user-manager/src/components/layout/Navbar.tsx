import {
  AppBar, Avatar, Box, styled, Toolbar,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import ChurchIcon from '@mui/icons-material/Church';
import { useSelector } from 'react-redux';
import { UserDetails } from '../../store/user/user-slice';
import { RootState } from '../../store';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const UserInfo = styled(Box)(() => ({
  display: 'flex',
  gap: '20px',
  alignItems: 'center',
}));

function stringToColor(string:string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name:string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default function Navbar() {
  const user:UserDetails = useSelector((state: RootState) => state.user);

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <ChurchIcon />
        <Box sx={{ flexGrow: 1, paddingLeft: 2 }}>
          <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' } }}>
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
