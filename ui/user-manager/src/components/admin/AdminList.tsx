import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { LinearProgress } from '@mui/material';
import { getAdminAPI } from '../../api/api';
import { User } from '../../generated-sources/openapi';
import { UserDetails } from '../../store/user/user-slice';

type AdminListProps={
  user:UserDetails;
}

export default function AdminList({ user }:AdminListProps) {
  const [rows, setRows] = useState([] as Array<User>);
  const [loading, setLoading] = useState(false);
  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'email', headerName: 'Email', width: 130, sortable: false,
    },
  ];

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

  return (
    <DataGrid
      initialState={{
        sorting: {
          sortModel: [{ field: 'firstName', sort: 'asc' }],
        },
      }}
      loading={loading}
      checkboxSelection
      rows={rows}
      columns={columns}
      hideFooterPagination
      components={{
        LoadingOverlay: LinearProgress,
      }}
    />
  );
}
