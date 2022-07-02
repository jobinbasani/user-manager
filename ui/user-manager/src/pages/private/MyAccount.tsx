import { Box } from '@mui/material';

import { useSelector } from 'react-redux';
import FamilyDetails from '../../components/family/FamilyDetails';
import { RootState } from '../../store';

export default function MyAccount() {
  const user = useSelector((state: RootState) => state.user);
  const family = useSelector((state: RootState) => state.family);
  return (
    <Box bgcolor="grey" flex={4} p={2}>
      <FamilyDetails user={user} family={family} />
    </Box>
  );
}
