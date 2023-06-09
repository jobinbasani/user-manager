import React, { useEffect, useRef, useState } from 'react';
import {
  DataGrid, gridClasses, GridColDef, GridToolbarContainer,
} from '@mui/x-data-grid';
import {
  alpha, Grid, LinearProgress, styled, TextField,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Button from '@mui/material/Button';
import { saveAs } from 'file-saver';
import { User } from '../../generated-sources/openapi';
import { getAdminAPI } from '../../api/api';
import { AdminProps } from '../../pages/private/Admin';
import StackContainer from '../layout/StackContainer';

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY
          + theme.palette.action.selectedOpacity
          + theme.palette.action.hoverOpacity,
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 'bold',
  },
}));

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
  const [showNav, setShowNav] = useState(true);
  const query = useRef('');
  const pageCursorMap = useRef<Map<number, string>>(new Map<number, string>([[0, '']]));

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
      .finally(() => {
        setLoading(false);
        setShowNav(true);
      });
  };

  const downloadUsers = () => {
    getAdminAPI(user.accessToken)
      .downloadUsers({ responseType: 'blob' })
      .then((resp) => {
        saveAs(resp.data, 'holyfamily_users.xlsx');
      });
  };

  const searchUser = () => {
    const lookup = query.current.split(' ')[0];
    if (lookup.length === 0) {
      return;
    }
    setLoading(true);
    getAdminAPI(user.accessToken).searchFamilyMembers(lookup)
      .then((results) => {
        setRows(results.data.total > 0 ? results.data.items : [] as Array<User>);
        setShowNav(false);
      })
      .finally(() => setLoading(false));
  };

  const onSearchKeyDown = (event:React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      searchUser();
    }
  };

  const cancelSearch = () => {
    query.current = '';
    loadUsers(pageCursorMap.current.get(page));
  };

  const searchBar = () => (
    <GridToolbarContainer>
      <TextField
        label="First name, last name or email"
        size="small"
        variant="standard"
        defaultValue={query.current}
        onKeyDown={onSearchKeyDown}
        onChange={(evt) => { query.current = evt.target.value; }}
      />
      <Button color="primary" onClick={() => searchUser()}>Search</Button>
      <Button
        color="error"
        onClick={() => cancelSearch()}
      >
        Cancel
      </Button>
    </GridToolbarContainer>
  );

  const paginator = () => (
    <Grid container justifyContent="flex-end">
      {showNav
        && (
          <>
            <Button startIcon={<CloudDownloadIcon />} onClick={() => downloadUsers()}>
              Download
            </Button>
            <Button disabled={page < 1} startIcon={<ArrowBackIosIcon />} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <Button
              disabled={!pageCursorMap.current.has(page + 1)}
              endIcon={<ArrowForwardIosIcon />}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </>
        )}
    </Grid>
  );

  useEffect(() => {
    if (!loading && pageCursorMap.current.has(page)) {
      loadUsers(pageCursorMap.current.get(page));
    }
  }, [page]);
  return (
    <StackContainer height={700}>
      <StripedDataGrid
        initialState={{
          sorting: {
            sortModel: [{ field: 'firstName', sort: 'asc' }],
          },
        }}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
        disableSelectionOnClick
        loading={loading}
        rows={rows}
        columns={columns}
        components={{
          LoadingOverlay: LinearProgress,
          Pagination: paginator,
          Toolbar: searchBar,
        }}
      />
    </StackContainer>
  );
}
