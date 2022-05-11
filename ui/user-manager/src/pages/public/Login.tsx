import { useCallback, useEffect, useState } from 'react';
import ProgressView from '../../components/UI/ProgressView';
import React from 'react';
import { useDispatch } from 'react-redux';
import { UserAuth } from '../../api/auth';
import { AccessToken } from '../../api/api-types';
import { doAuth } from '../../store/auth/auth-action';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../store/user/user-action';

const Login = () => {
    const dispatch = useDispatch();

    const location = useLocation();
    const navigate = useNavigate();

    const currentLocation = useState(window.location.href);

    useEffect(()=>{
      console.dir(location);
      
    },[location]);

    const updateToken = useCallback((accessToken: AccessToken) => {
        dispatch(doAuth(accessToken));
        dispatch(getUserInfo());
        navigate("/");
    },[dispatch, navigate]);
  
    useEffect(() => {
      const token:AccessToken | null = UserAuth.getAccessTokenFromUrl(currentLocation[0].toString());
      if (token && token.expiresIn > 0) {
        updateToken(token);
      }
    }, [currentLocation, updateToken]);

    return(
        <React.Fragment>
            <ProgressView text="Redirecting. Please Wait ..."></ProgressView>
        </React.Fragment>
    );

}

export default Login;