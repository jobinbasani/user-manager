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
import React, { useState } from 'react';
import PeopleIcon from '@mui/icons-material/People';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PersonRemove } from '@mui/icons-material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { stringAvatar } from '../../util/util';
import AddUpdateFamilyMember, { AddUpdateFamilyDetailsProps, UserRecord } from '../form/AddUpdateFamilyMember';
import UserDetails from '../user/UserDetails';
import { UserDataProvinceEnum } from '../../generated-sources/openapi';

type FamilyDetailsProps = Omit<AddUpdateFamilyDetailsProps, 'showFormFn'|'initialValues'> & {
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
  const [initialMemberData, setInitialMemberData] = useState<UserRecord>({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    gender: '',
    baptismalName: '',
    relation: '',
    houseName: '',
    familyUnit: '',
    dateOfBirth: null,
    dateOfBaptism: null,
    dateOfConfirmation: null,
    maritalStatus: '',
    canadianStatus: '',
    inCanadaSince: null,
    homeParish: '',
    dioceseInIndia: '',
    previousParishInCanada: '',
    apartment: '',
    street: '',
    city: '',
    province: UserDataProvinceEnum.Ns,
    postalCode: '',
    mobile: '',
  });

  const showConfirmDialog = (displayName:string, userId:string) => {
    setDeleteUserName(displayName);
    setDeleteUserId(userId);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  const handleAddMemberClick = () => {
    const newUserData:UserRecord = {
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      gender: '',
      baptismalName: '',
      relation: '',
      houseName: '',
      familyUnit: '',
      dateOfBirth: null,
      dateOfBaptism: null,
      dateOfConfirmation: null,
      maritalStatus: '',
      canadianStatus: '',
      inCanadaSince: null,
      homeParish: '',
      dioceseInIndia: '',
      previousParishInCanada: '',
      apartment: '',
      street: '',
      city: '',
      province: UserDataProvinceEnum.Ns,
      postalCode: '',
      mobile: '',
    };
    if (family.members.length === 0) {
      newUserData.firstName = user.userInfo.firstName;
      newUserData.lastName = user.userInfo.lastName;
      newUserData.email = user.userInfo.userEmail;
    } else {
      const primaryAcct = family.members[0];
      newUserData.familyUnit = primaryAcct.familyUnit;
      newUserData.apartment = primaryAcct.apartment;
      newUserData.street = primaryAcct.street;
      newUserData.city = primaryAcct.city;
      newUserData.postalCode = primaryAcct.postalCode;
    }
    setInitialMemberData(newUserData);
    setFormVisible(!formVisible);
  };

  const deleteUser = async () => {
    closeConfirmDialog();
    await onDeleteMember(deleteUserId);
  };

  const editUser = (userId:string) => {
    if (formVisible) {
      setFormVisible(false);
      return;
    }
    const userToBeEdited = family.members.find((u) => u.id === userId);
    if (!editUser) {
      return;
    }
    const initialData:UserRecord = {
      firstName: userToBeEdited?.firstName || '',
      lastName: userToBeEdited?.lastName || '',
      middleName: userToBeEdited?.middleName || '',
      email: userToBeEdited?.email || '',
      gender: userToBeEdited?.gender || '',
      baptismalName: userToBeEdited?.baptismalName || '',
      relation: userToBeEdited?.relation || '',
      houseName: userToBeEdited?.houseName || '',
      familyUnit: userToBeEdited?.familyUnit || '',
      dateOfBirth: userToBeEdited?.dateOfBirth || null,
      dateOfBaptism: userToBeEdited?.dateOfBaptism || null,
      dateOfConfirmation: userToBeEdited?.dateOfConfirmation || null,
      maritalStatus: userToBeEdited?.maritalStatus || '',
      canadianStatus: userToBeEdited?.canadianStatus || '',
      inCanadaSince: userToBeEdited?.inCanadaSince || null,
      homeParish: userToBeEdited?.homeParish || '',
      dioceseInIndia: userToBeEdited?.dioceseInIndia || '',
      previousParishInCanada: userToBeEdited?.previousParishInCanada || '',
      apartment: userToBeEdited?.apartment || '',
      street: userToBeEdited?.street || '',
      city: userToBeEdited?.city || '',
      province: userToBeEdited?.province || UserDataProvinceEnum.Ns,
      postalCode: userToBeEdited?.postalCode || '',
      mobile: userToBeEdited?.mobile || '',
    };
    setInitialMemberData(initialData);
    setFormVisible(true);
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
                  <UserDetails member={member} />
                  <br />
                  <Divider light />
                  <Button
                    color="primary"
                    size="small"
                    onClick={() => editUser(member.id ? member.id : '')}
                    startIcon={<BorderColorIcon />}
                    sx={{ flex: 1 }}
                  >
                    Edit
                  </Button>
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
          <AddUpdateFamilyMember user={user} initialValues={initialMemberData} family={family} showFormFn={setFormVisible} onAddMember={onAddMember} />
        </CardContent>
      </Collapse>
    </Card>
  );
}
