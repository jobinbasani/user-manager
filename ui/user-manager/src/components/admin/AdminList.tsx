import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { LinearProgress } from '@mui/material';
import { User } from '../../generated-sources/openapi';

type AdminListProps={
  rows: User[];
  loading: boolean;
}

export default function AdminList({ rows, loading }:AdminListProps) {
  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'email', headerName: 'Email', width: 130, sortable: false,
    },
  ];

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
      hideFooter
      components={{
        LoadingOverlay: LinearProgress,
      }}
    />
  );
}
