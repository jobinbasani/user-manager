import React from 'react';
import { useSelector } from 'react-redux';
import { getAdminAPI, getPublicAPI } from '../../api/api';
import { RootState } from '../../store';
import EditablePage from '../../components/editor/EditablePage';

export default function Catechism() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <EditablePage
      title="Catechism"
      user={user}
      loadData={() => getPublicAPI().getCatechism()}
      submitData={(pc) => getAdminAPI(user.accessToken).setCatechismData(pc)}
    />
  );
}
