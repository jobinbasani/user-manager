import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import ProgressView from '../../components/UI/ProgressView';
import React from 'react';
import { useDispatch } from 'react-redux';
import { UserAuth } from '../../api/auth';
import { AccessToken } from '../../api/api-types';
import { doAuth } from '../../store/auth/auth-action';

const Login = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const token:AccessToken | null = UserAuth.getAccessTokenFromUrl(location.hash);

    const updateToken = useCallback((accessToken: AccessToken) => {
        dispatch(doAuth(accessToken));
        navigate("/dashboard");
    },[dispatch, navigate]);

    useEffect(() => {
        if (token?.accessToken) {
            updateToken(token);
        }
    }, [token, updateToken]);

    return(
        <React.Fragment>
            <ProgressView text="Redirecting. Please Wait ..."></ProgressView>
        </React.Fragment>
    );

}

export default Login;