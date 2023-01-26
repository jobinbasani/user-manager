import {
  AlertColor, Stack, TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import React, {
  useEffect, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { User } from '../../generated-sources/openapi';
import { getAdminAPI } from '../../api/api';
import AdminList from './AdminList';
import InfoBar from '../common/InfoBar';
import StackContainer from '../layout/StackContainer';

export default function ManageAdmins() {
  const user = useSelector((state: RootState) => state.user);
  const [query, setQuery] = useState('');
  const [selectedAdmins, setSelectedAdmins] = useState([] as Array<User>);
  const [selectedAdminResults, setSelectedAdminResults] = useState([] as Array<User>);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [rows, setRows] = useState([] as Array<User>);
  const [searchRows, setSearchRows] = useState([] as Array<User>);
  const [showAddForm, setShowAddForm] = useState(false);
  const [infoBarOpen, setInfoBarOpen] = useState(false);
  const [infoBarMessage, setInfoBarMessage] = useState('');
  const [infoBarSeverity, setInfoBarSeverity] = useState<AlertColor>('success');

  const setInfoBarValues = (severity:AlertColor, message:string, isOpen?:boolean) => {
    setInfoBarMessage(message);
    setInfoBarSeverity(severity);
    setInfoBarOpen(isOpen || true);
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

  const onSearchKeyDown = (event:React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      lookupUser();
    }
  };

  const cancelSearch = () => {
    setShowAddForm(false);
    setSearchRows([] as Array<User>);
  };
  const addToAdmin = () => {
    getAdminAPI(user.accessToken)
      .addToAdminGroup(selectedAdminResults.map((sa) => sa.id))
      .then(() => {
        setInfoBarValues('success', 'Admins added successfully!');
      })
      .catch(() => setInfoBarValues('error', 'There was an error adding selected users to admin group'))
      .finally(() => {
        loadAdmins();
        cancelSearch();
      });
  };

  const removeFromAdmins = () => {
    getAdminAPI(user.accessToken)
      .removeFromAdminGroup(selectedAdmins.map((sa) => sa.id))
      .then(() => {
        setInfoBarValues('success', 'Admins removed successfully!');
      })
      .catch(() => setInfoBarValues('error', 'There was an error removing selected users from admin group'))
      .finally(() => loadAdmins());
  };

  return (
    <StackContainer>
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
                onKeyDown={onSearchKeyDown}
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
      <InfoBar isOpen={infoBarOpen} onClose={() => { setInfoBarOpen(false); }} message={infoBarMessage} severity={infoBarSeverity} />
    </StackContainer>
  );
}
