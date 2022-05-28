import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  Avatar,
  Box, CardActions,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import { RootState } from '../../store';

export default function MyAccount() {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      window.history.replaceState(null, '', '/myaccount');
    }
  }, [isLoggedIn]);

  return (
    <Box bgcolor="grey" flex={4} p={2}>
      <Card>
        <CardHeader title="My Family" />
        <CardContent>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {[0, 1, 2, 3].map((value) => {
              const labelId = `checkbox-list-secondary-label-${value}`;
              return (
                <ListItem
                  key={value}
                  secondaryAction={(
                    <EditIcon />
                  )}
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemAvatar>
                      <Avatar
                        alt={`Avatar n°${value + 1}`}
                        src={`/static/images/avatar/${value + 1}.jpg`}
                      />
                    </ListItemAvatar>
                    <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
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
