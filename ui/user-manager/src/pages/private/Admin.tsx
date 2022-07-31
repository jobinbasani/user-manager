import { Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AdminList from '../../components/admin/AdminList';
import { RootState } from '../../store';
import { User } from '../../generated-sources/openapi';
import { getAdminAPI } from '../../api/api';

export default function Admin() {
  const user = useSelector((state: RootState) => state.user);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [rows, setRows] = useState([] as Array<User>);
  const [searchRows, setSearchRows] = useState([] as Array<User>);
  const [showAddForm, setShowAddForm] = useState(false);
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
          <AdminList loading={loading} rows={rows} />
          <Container disableGutters>
            <Button color="primary" onClick={() => setShowAddForm(true)}>Add Admin</Button>
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
            <Button color="error" onClick={() => setShowAddForm(false)}>Cancel</Button>
          </Stack>
          <AdminList loading={searchLoading} rows={searchRows} />
        </>
      )}
    </Stack>
  );
}
