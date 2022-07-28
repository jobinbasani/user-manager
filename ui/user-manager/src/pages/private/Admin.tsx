import { Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import AdminList from '../../components/admin/AdminList';
import { RootState } from '../../store';

export default function Admin() {
  const user = useSelector((state: RootState) => state.user);
  const [query, setQuery] = useState('');
  const lookupUser = () => {
    console.log(query);
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
      <AdminList user={user} />
      <Container disableGutters>
        <Button color="primary">Add Admin</Button>
      </Container>
      <Stack
        direction="row"
        spacing={2}
      >
        <TextField label="First name, last name or email" variant="standard" onChange={(evt) => setQuery(evt.target.value)} />
        <Button color="primary" onClick={() => lookupUser()}>Search</Button>
      </Stack>
    </Stack>
  );
}
