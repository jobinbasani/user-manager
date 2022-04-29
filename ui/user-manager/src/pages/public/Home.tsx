
import HomeCarousel from '../../components/carousel/HomeCarousel';
import {Grid, Card} from '@mui/material';
import PastoralMessage from '../../components/message/PastoralMessage';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { UserAuth } from '../../api/auth';
import { AccessToken } from '../../api/api-types';
import { useCallback, useEffect, useState } from 'react';
import { doAuth } from '../../store/auth/auth-action';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentLocation = useState(window.location.href);

  const updateToken = useCallback((accessToken: AccessToken) => {
      dispatch(doAuth(accessToken));
      navigate("/dashboard");
  },[dispatch, navigate]);

  useEffect(() => {
    const token:AccessToken | null = UserAuth.getAccessTokenFromUrl(currentLocation.toString());
    if (token && token.expiresIn > 0) {
      updateToken(token);
    }
  }, [currentLocation, updateToken]);

  return(
      <div>
          <HomeCarousel />
          <Grid container spacing={2}>
            <Grid item xs={8}>
            <PastoralMessage />
            </Grid>
            <Grid item xs={4}>
              <Card elevation={3} >xs=4</Card>
            </Grid>
          </Grid>
      </div>
  );
}

export default Home;