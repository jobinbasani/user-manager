import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LinearProgress } from '@mui/material';
import { RootState } from '../../store';
import { getAdminAPI } from '../../api/api';
import { User } from '../../generated-sources/openapi';

export default function AdminList() {
  const isAdmin = useSelector((state: RootState) => state.user.isAdmin);
  const user = useSelector((state: RootState) => state.user);
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
  }, [isAdmin]);

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
