import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getAdminAPI } from '../../api/api';
import { User } from '../../generated-sources/openapi';

export default function AdminList() {
  const isAdmin = useSelector((state: RootState) => state.user.isAdmin);
  const user = useSelector((state: RootState) => state.user);
  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    { field: 'email', headerName: 'Email', width: 130 },
  ];
  const [rows, setRows] = useState([] as Array<User>);

  const loadAdmins = () => {
    getAdminAPI(user.accessToken).getAdmins()
      .then((admins) => {
        if (admins.data.total > 0) {
          setRows(admins.data.items);
        }
      })
      .finally(() => console.log('loaded'));
  };

  useEffect(() => {
    loadAdmins();
  }, [isAdmin]);

  return (
    <DataGrid rows={rows} columns={columns} />
  );
}
