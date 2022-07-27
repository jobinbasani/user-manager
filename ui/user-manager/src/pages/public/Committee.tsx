import React from 'react';
import { useSelector } from 'react-redux';
import { getAdminAPI, getPublicAPI } from '../../api/api';
import { RootState } from '../../store';
import EditablePage from '../../components/editor/EditablePage';

export default function Committee() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <EditablePage
      title="Committee"
      user={user}
      loadData={() => getPublicAPI().getCommittee()}
      submitData={(pc) => getAdminAPI(user.accessToken).setCommitteeData(pc)}
    />
  );
}
