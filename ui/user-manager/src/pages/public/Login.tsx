import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import ProgressView from '../../components/UI/ProgressView';
import React from 'react';
import { useDispatch } from 'react-redux';
import { UserAuth } from '../../api/auth';
import { AccessToken } from '../../api/api-types';
import { doAuth } from '../../store/auth/auth-action';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    

    const currentLocation = useState(window.location.href);

    const updateToken = useCallback((accessToken: AccessToken) => {
        dispatch(doAuth(accessToken));
        navigate("/dashboard");
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