import { Stack } from '@mui/material';
import AdminList from '../../components/admin/AdminList';

export default function Admin() {
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
      <AdminList />
    </Stack>
  );
}
