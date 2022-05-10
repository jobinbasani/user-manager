import { useCallback, useEffect, useState } from 'react';
import ProgressView from '../../components/UI/ProgressView';
import React from 'react';
import { useDispatch } from 'react-redux';
import { UserAuth } from '../../api/auth';
import { AccessToken } from '../../api/api-types';
import { doAuth } from '../../store/auth/auth-action';
import { useLocation } from 'react-router-dom';


import { Utils } from '../../utils/utils';


const Login = () => {
    const dispatch = useDispatch();

    const location = useLocation();
    

    const currentLocation = useState(window.location.href);

    useEffect(()=>{
      console.dir(location);
      
    },[location]);

    const updateToken = useCallback((accessToken: AccessToken) => {
      const theRoot = window.location.href;
        dispatch(doAuth(accessToken));
        const rootLocation = Utils.getRootUrl(theRoot); 
        window.location.href = rootLocation;
    },[dispatch]);
  
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