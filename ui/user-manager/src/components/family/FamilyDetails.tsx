import Card from '@mui/material/Card';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  CardActions,
  CardHeader,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  LinearProgress,
  List,
} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import Button from '@mui/material/Button';
import { useState } from 'react';
import PeopleIcon from '@mui/icons-material/People';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns';
import { PersonRemove } from '@mui/icons-material';
import { stringAvatar } from '../../util/util';
import AddFamilyMember, { AddFamilyDetailsProps } from '../form/AddFamilyMember';
import TitleAndSubtitle from '../text/TitleAndSubtitle';
import { UserDataGenderEnum } from '../../generated-sources/openapi';

type FamilyDetailsProps = Omit<AddFamilyDetailsProps, 'showFormFn'> & {
  isLoading: boolean;
  onDeleteMember:((deleteUserId: string) => Promise<void>);
}

export default function FamilyDetails({
  user, family, isLoading, onAddMember, onDeleteMember,
}: FamilyDetailsProps) {
  const [formVisible, setFormVisible] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteUserName, setDeleteUserName] = useState('');
  const [deleteUserId, setDeleteUserId] = useState('');

  const showConfirmDialog = (displayName:string, userId:string) => {
    setDeleteUserName(displayName);
    setDeleteUserId(userId);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  const handleAddMemberClick = () => {
    setFormVisible(!formVisible);
  };

  const deleteUser = async () => {
    closeConfirmDialog();
    await onDeleteMember(deleteUserId);
  };

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
        {isLoading && <LinearProgress />}
        {family.members.length === 0 && !isLoading && <Chip label="No members added yet!" color="error" variant="outlined" />}

        <Dialog
          open={confirmDialogOpen}
          onClose={closeConfirmDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Confirm
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`This will remove ${deleteUserName} from the family. Continue?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirmDialog}>No</Button>
            <Button onClick={deleteUser} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <List sx={{
          width: '100%',
          bgcolor: 'background.paper',
        }}
        >
          {family.members.map((member, idx) => {
            const panelId = `panel-header-${idx}`;
            return (
              <Accordion disableGutters key={member.id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  id={panelId}
                >
                  <Chip
                    avatar={(
                      <Avatar {...stringAvatar(member.displayName
                        ? member.displayName
                        : member.firstName)}
                      />
                    )}
                    sx={{ '& .MuiChip-avatar': { color: '#fff' } }}
                    label={`${member.firstName} ${member.lastName}`}
                    variant="outlined"
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <TitleAndSubtitle title="Gender" subtitle={Object.keys(UserDataGenderEnum)[Object.values(UserDataGenderEnum).indexOf(member.gender)]} />
                  <TitleAndSubtitle title="Birthday" subtitle={format(new Date(member.dateOfBirth), 'MMM d, yyyy')} />
                  <TitleAndSubtitle title="Email" subtitle={member.email} />
                  <br />
                  <Divider light />
                  <Button
                    color="error"
                    size="small"
                    onClick={() => showConfirmDialog(member.displayName ?? '', member.id ?? '')}
                    startIcon={<PersonRemove />}
                    sx={{ flex: 1 }}
                  >
                    Remove
                  </Button>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </List>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleAddMemberClick} startIcon={<AddReactionIcon />} sx={{ marginLeft: 'auto' }}>Add Member</Button>
      </CardActions>
      <Collapse in={formVisible} timeout="auto" unmountOnExit>
        <CardContent>
          <AddFamilyMember user={user} family={family} showFormFn={setFormVisible} onAddMember={onAddMember} />
        </CardContent>
      </Collapse>
    </Card>
  );
}
