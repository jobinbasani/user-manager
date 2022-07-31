import { Snackbar, Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {
  Dispatch,
  forwardRef, SetStateAction, SyntheticEvent, useEffect, useState,
} from 'react';
import { useSelector } from 'react-redux';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import AdminList from '../../components/admin/AdminList';
import { RootState } from '../../store';
import { User } from '../../generated-sources/openapi';
import { getAdminAPI } from '../../api/api';

const Alert = forwardRef<HTMLDivElement, AlertProps>((
  props,
  ref,
) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

export default function Admin() {
  const user = useSelector((state: RootState) => state.user);
  const [query, setQuery] = useState('');
  const [selectedAdmins, setSelectedAdmins] = useState([] as Array<User>);
  const [selectedAdminResults, setSelectedAdminResults] = useState([] as Array<User>);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [rows, setRows] = useState([] as Array<User>);
  const [searchRows, setSearchRows] = useState([] as Array<User>);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuccessAdminAdd, setShowSuccessAdminAdd] = useState(false);
  const [showFailureAdminAdd, setShowFailureAdminAdd] = useState(false);
  const [showSuccessAdminRemove, setShowSuccessAdminRemove] = useState(false);
  const [showFailureAdminRemove, setShowFailureAdminRemove] = useState(false);

  const checkAndCloseSnackBar = (fn: Dispatch<SetStateAction<boolean>>, event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    fn(false);
  };

  const closeSuccessAdminAddMessage = (event?: SyntheticEvent | Event, reason?: string) => {
    checkAndCloseSnackBar(setShowSuccessAdminAdd, event, reason);
  };

  const closeFailureAdminAddMessage = (event?: SyntheticEvent | Event, reason?: string) => {
    checkAndCloseSnackBar(setShowFailureAdminAdd, event, reason);
  };

  const closeSuccessAdminRemoveMessage = (event?: SyntheticEvent | Event, reason?: string) => {
    checkAndCloseSnackBar(setShowSuccessAdminRemove, event, reason);
  };

  const closeFailureAdminRemoveMessage = (event?: SyntheticEvent | Event, reason?: string) => {
    checkAndCloseSnackBar(setShowFailureAdminRemove, event, reason);
  };

  const loadAdmins = () => {
    if (!user.isAdmin) {
      return;
    }
    setLoading(true);
    getAdminAPI(user.accessToken).getAdmins()
      .then((admins) => {
        if (admins.data.total > 0) {
          setRows(admins.data.items);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAdmins();
  }, [user]);

  const lookupUser = () => {
    const lookup = query.split(' ')[0];
    if (lookup.length === 0) {
      return;
    }
    setSearchLoading(true);
    getAdminAPI(user.accessToken).searchSignedUpUsers(lookup)
      .then((results) => {
        if (results.data.total > 0) {
          setSearchRows(results.data.items);
        } else {
          setSearchRows([] as Array<User>);
        }
      })
      .finally(() => setSearchLoading(false));
  };
  const cancelSearch = () => {
    setShowAddForm(false);
    setSearchRows([] as Array<User>);
  };
  const addToAdmin = () => {
    getAdminAPI(user.accessToken)
      .addToAdminGroup(selectedAdminResults.map((sa) => sa.id))
      .then(() => {
        setShowSuccessAdminAdd(true);
      })
      .catch(() => setShowFailureAdminAdd(true))
      .finally(() => {
        loadAdmins();
        cancelSearch();
      });
  };

  const removeFromAdmins = () => {
    getAdminAPI(user.accessToken)
      .removeFromAdminGroup(selectedAdmins.map((sa) => sa.id))
      .then(() => {
        setShowSuccessAdminRemove(true);
      })
      .catch(() => setShowFailureAdminRemove(true))
      .finally(() => loadAdmins());
  };

  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        height: 400,
        width: {
          sm: 0.92,
          md: 0.5,
        },
      }}
      p={2}
    >
      {!showAddForm
      && (
        <>
          <AdminList loading={loading} rows={rows} onRowSelect={setSelectedAdmins} />
          <Container disableGutters>
            <Button color="primary" onClick={() => setShowAddForm(true)}>Add Admin</Button>
            {selectedAdmins.length > 0 && <Button color="error" onClick={removeFromAdmins}>Remove Admin</Button>}
          </Container>
        </>
      )}
      {showAddForm
      && (
        <>
          <Stack
            direction="row"
            spacing={2}
          >
            <TextField
              label="First name, last name or email"
              size="small"
              variant="standard"
              onChange={(evt) => setQuery(evt.target.value)}
            />
            <Button color="primary" onClick={() => lookupUser()}>Search</Button>
            <Button
              color="error"
              onClick={() => cancelSearch()}
            >
              Cancel
            </Button>
          </Stack>
          <AdminList loading={searchLoading} rows={searchRows} onRowSelect={setSelectedAdminResults} />
          <Container disableGutters>
            {selectedAdminResults.length > 0 && <Button color="primary" onClick={addToAdmin}>Set As Admin</Button>}
          </Container>
        </>
      )}
      <Snackbar open={showSuccessAdminAdd} autoHideDuration={3000} onClose={closeSuccessAdminAddMessage}>
        <Alert onClose={closeSuccessAdminAddMessage} severity="success" sx={{ width: '100%' }}>
          Admins added successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={showFailureAdminAdd} autoHideDuration={3000} onClose={closeFailureAdminAddMessage}>
        <Alert onClose={closeFailureAdminAddMessage} severity="error" sx={{ width: '100%' }}>
          There was an error adding selected users to admin group
        </Alert>
      </Snackbar>
      <Snackbar open={showSuccessAdminRemove} autoHideDuration={3000} onClose={closeSuccessAdminRemoveMessage}>
        <Alert onClose={closeSuccessAdminRemoveMessage} severity="success" sx={{ width: '100%' }}>
          Admins removed successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={showFailureAdminRemove} autoHideDuration={3000} onClose={closeFailureAdminRemoveMessage}>
        <Alert onClose={closeFailureAdminRemoveMessage} severity="error" sx={{ width: '100%' }}>
          There was an error removing selected users from admin group
        </Alert>
      </Snackbar>
    </Stack>
  );
}
