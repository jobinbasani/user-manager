import { Box } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import FamilyDetails from '../../components/family/FamilyDetails';
import { RootState } from '../../store';
import { getFamilyManagementAPI } from '../../api/api';
import { setFamilyDetails } from '../../store/family/family-slice';
import { UserData } from '../../generated-sources/openapi';

export default function MyAccount() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const family = useSelector((state: RootState) => state.family);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      window.history.replaceState(null, '', '/myaccount');
    }
  }, [user]);

  const loadFamilyData = async () => {
    setLoading(true);
    const familyDetails = await getFamilyManagementAPI(user.accessToken).getUserFamily();
    dispatch(setFamilyDetails(familyDetails.data));
  };

  const onMemberDataSubmit = async (userData:UserData, editUserId:string|null) => {
    if (editUserId && editUserId.length > 0) {
      return getFamilyManagementAPI(user.accessToken).updateFamilyMember(editUserId, userData)
        .then(() => getFamilyManagementAPI(user.accessToken).getUserFamily())
        .then((familyDetails) => dispatch(setFamilyDetails(familyDetails.data)));
    }
    return getFamilyManagementAPI(user.accessToken).addFamilyMembers([userData])
      .then(() => getFamilyManagementAPI(user.accessToken).getUserFamily())
      .then((familyDetails) => dispatch(setFamilyDetails(familyDetails.data)));
  };

  const deleteUser = async (deleteUserId: string) => {
    if (user.isLoggedIn) {
      setLoading(true);
      getFamilyManagementAPI(user.accessToken)
        .deleteFamilyMembers([deleteUserId])
        .then(loadFamilyData)
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    if (user.isLoggedIn) {
      loadFamilyData().finally(() => setLoading(false));
    }
  });

  return (
    <Box bgcolor="grey" flex={4} p={2}>
      <FamilyDetails user={user} family={family} relatedUser="" isLoading={isLoading} onMemberDataSubmit={onMemberDataSubmit} onDeleteMember={deleteUser} />
    </Box>
  );
}
