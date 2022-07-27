import React from 'react';
import { useSelector } from 'react-redux';
import { getAdminAPI, getPublicAPI } from '../../api/api';
import { RootState } from '../../store';
import EditablePage from '../../components/editor/EditablePage';

export default function Services() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <EditablePage
      title="Services"
      user={user}
      loadData={() => getPublicAPI().getServices()}
      submitData={(pc) => getAdminAPI(user.accessToken).setServiceData(pc)}
    />
  );
}
