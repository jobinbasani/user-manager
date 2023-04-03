import React, { useEffect, useRef, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Grid, LinearProgress } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from '@mui/material/Button';
import { User } from '../../generated-sources/openapi';
import { getAdminAPI } from '../../api/api';
import { AdminProps } from '../../pages/private/Admin';
import StackContainer from '../layout/StackContainer';

export default function ManageUsers({ user }:AdminProps) {
  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'email', headerName: 'Email', width: 200, sortable: false,
    },
  ];
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([] as Array<User>);
  const [loading, setLoading] = useState(false);
  const pageCursorMap = useRef<Map<number, string>>(new Map<number, string>([[0, '']]));

  const paginator = () => (
    <Grid container justifyContent="flex-end">
      <Button disabled={page < 1} startIcon={<ArrowBackIosIcon />} onClick={() => setPage(page - 1)}>
        Previous
      </Button>
      <Button disabled={!pageCursorMap.current.has(page + 1)} endIcon={<ArrowForwardIosIcon />} onClick={() => setPage(page + 1)}>
        Next
      </Button>
    </Grid>
  );

  const loadUsers = (startToken:string|undefined) => {
    if (!user.isAdmin) {
      return;
    }
    setLoading(true);
    getAdminAPI(user.accessToken).listUsers(startToken)
      .then((userResponse) => {
        if (userResponse.data.next) {
          pageCursorMap.current.set(page + 1, userResponse.data.next);
        }
        if (userResponse.data.total > 0) {
          setRows(userResponse.data.items);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!loading && pageCursorMap.current.has(page)) {
      loadUsers(pageCursorMap.current.get(page));
    }
  }, [page]);
  return (
    <StackContainer>
      <DataGrid
        paginationMode="server"
        disableSelectionOnClick
        loading={loading}
        rows={rows}
        columns={columns}
        components={{
          LoadingOverlay: LinearProgress,
          Pagination: paginator,
        }}
      />
    </StackContainer>
  );
}
