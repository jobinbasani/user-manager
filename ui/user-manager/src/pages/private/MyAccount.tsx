import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  Avatar,
  Box, CardActions,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText, Skeleton,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import { RootState } from '../../store';
import { setFamilyDetails } from '../../store/family/family-slice';
import { getFamilyManagementAPI } from '../../api/api';

export default function MyAccount() {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const family = useSelector((state: RootState) => state.family);

  useEffect(() => {
    if (user) {
      window.history.replaceState(null, '', '/myaccount');
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const familyDetails = await getFamilyManagementAPI(user.accessToken).getUserFamily();
      dispatch(setFamilyDetails(familyDetails.data));
    };
    if (user.isLoggedIn) {
      fetchData();
    }
  }, [dispatch, user]);

  return (
    <Box bgcolor="grey" flex={4} p={2}>
      <Card>
        <CardHeader title="My Family" />
        <CardContent>

          {family.isLoading
          && <Skeleton variant="rectangular" />}
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {family.members.map((member, idx) => {
              const labelId = `checkbox-list-secondary-label-${idx}`;
              return (
                <ListItem
                  key={member.firstName}
                  secondaryAction={(
                    <EditIcon />
                  )}
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemAvatar>
                      <Avatar
                        alt={`Avatar n°${idx}`}
                        src={`/static/images/avatar/${idx}.jpg`}
                      />
                    </ListItemAvatar>
                    <ListItemText id={labelId} primary={`${member.firstName} ${member.lastName}`} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </CardContent>
        <CardActions>
          <Button size="small">Add Member</Button>
        </CardActions>
      </Card>
    </Box>
  );
}
