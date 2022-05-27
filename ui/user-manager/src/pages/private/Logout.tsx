import { Box, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser, UserDetails } from '../../store/user/user-slice';
import { RootState } from '../../store';

export default function Logout() {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const user:UserDetails = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  useEffect(() => {
    if (!user.isLoggedIn) {
      navigateTo('/feed');
    }
  }, [user]);

  return (
    user.isLoggedIn
      ? (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      )
      : null
  );
}
