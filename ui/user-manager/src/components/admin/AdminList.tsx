import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { LinearProgress } from '@mui/material';
import { User } from '../../generated-sources/openapi';

type AdminListProps={
  rows: User[];
  loading: boolean;
  onRowSelect:((rows: User[])=> void)
}

export default function AdminList({ rows, loading, onRowSelect }:AdminListProps) {
  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'email', headerName: 'Email', width: 200, sortable: false,
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
      onSelectionModelChange={(ids) => {
        const selectedIDs = new Set(ids);
        const selectedRows = rows.filter((row) => selectedIDs.has(row.id));
        onRowSelect(selectedRows);
      }}
    />
  );
}
