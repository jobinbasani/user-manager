import { AccessToken } from '../../api/api-types';
import { authActions } from '../../store/auth/auth-slice';

export const doAuth = (token : AccessToken) => {
    return async (dispatch: any) => {
        dispatch(authActions.setAuthenticated(token));
    }
}

export const doLogout = () => {
    return async (dispatch: any) => {
        dispatch(authActions.resetAuthStatus());
    }
}

export const doInit = () => {
    return async (dispatch: any) => {
        dispatch(authActions.initializeAuthStatus());
    }
}