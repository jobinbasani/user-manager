import { Box } from '@mui/material';

import FamilyDetails from '../../components/family/FamilyDetails';

export default function MyAccount() {
  return (
    <Box bgcolor="grey" flex={4} p={2}>
      <FamilyDetails />
    </Box>
  );
}
