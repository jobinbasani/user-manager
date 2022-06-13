import Card from '@mui/material/Card';
import {
  Avatar, CardActions,
  CardHeader, Chip, Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import EditIcon from '@mui/icons-material/Edit';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import PeopleIcon from '@mui/icons-material/People';
import { stringAvatar } from '../../util/util';
import { RootState } from '../../store';
import { getFamilyManagementAPI } from '../../api/api';
import { setFamilyDetails } from '../../store/family/family-slice';
import AddFamilyMember from '../form/AddFamilyMember';

export default function FamilyDetails() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const family = useSelector((state: RootState) => state.family);
  const [isLoading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const handleAddMemberClick = () => {
    setFormVisible(!formVisible);
  };

  useEffect(() => {
    if (user) {
      window.history.replaceState(null, '', '/myaccount');
    }
  }, [user]);

  useEffect(() => {
    const loadFamilyData = async () => {
      setLoading(true);
      const familyDetails = await getFamilyManagementAPI(user.accessToken).getUserFamily();
      dispatch(setFamilyDetails(familyDetails.data));
    };
    if (user.isLoggedIn) {
      loadFamilyData().finally(() => setLoading(false));
    }
  }, [dispatch, user]);

  return (
    <Card>
      <CardHeader
        sx={{ '& .MuiCardHeader-title': { fontWeight: 500 } }}
        avatar={(
          <Avatar sx={{ backgroundColor: 'transparent' }}>
            <PeopleIcon color="primary" />
          </Avatar>
        )}
        title="My Family"
      />

      <CardContent>
        {isLoading
                    && <Skeleton variant="rectangular" />}
        {family.members.length === 0 && !isLoading && <Chip label="No members added yet!" color="error" variant="outlined" />}
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {family.members.map((member, idx) => {
            const labelId = `checkbox-list-secondary-label-${idx}`;
            return (
              <ListItem
                key={member.id}
                secondaryAction={(
                  <EditIcon color="primary" />
                )}
                disablePadding
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar {...stringAvatar(member.displayName
                      ? member.displayName
                      : member.firstName)}
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
        <Button size="small" onClick={handleAddMemberClick} startIcon={<AddReactionIcon />} sx={{ marginLeft: 'auto' }}>Add Member</Button>
      </CardActions>
      <Collapse in={formVisible} timeout="auto" unmountOnExit>
        <CardContent>
          <AddFamilyMember />
        </CardContent>
      </Collapse>
    </Card>
  );
}
