
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccessToken } from '../../api/api-types';

interface AuthState {
    initialized: boolean;
    isAuthenticated: boolean;
    accessToken: AccessToken | null | undefined;
};

const initialAuthState: AuthState = {
    initialized: false,
    isAuthenticated: false,
    accessToken: null
};

let logoutTimer: any;

const loginHandler = (token: AccessToken) => {
    const expirationTime = new Date(
        new Date().getTime() + +token.expiresIn * 1000
      );
    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem('expirationTime', expirationTime.toISOString());

    const remainingTime = calculateRemainingTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
}

const calculateRemainingTime = (expirationTime: Date): number => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
  
    const remainingDuration = adjExpirationTime - currentTime;
  
    return remainingDuration;
}

const initAuthStatusHandler = () => {
    console.log("Initialize authentication status ************************");
    const storedExpirationDate: string|null = localStorage.getItem('expirationTime');
    if (storedExpirationDate) {
        const remainingTime: number = calculateRemainingTime(new Date(storedExpirationDate));
        if (remainingTime <= 3600) {
            localStorage.removeItem("expirationTime");
            localStorage.removeItem("token");
        } else {
            logoutTimer = setTimeout(logoutHandler, remainingTime);
        }
    }
}

const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");

    if (logoutTimer) {
        clearTimeout(logoutTimer);
    }
}

const authSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {
        setAuthenticated: (state: AuthState, action: PayloadAction<AccessToken>) => {
            state.isAuthenticated = true;
            let token: AccessToken = action.payload;
            loginHandler(token);
            
            state.accessToken = token;
            state.isAuthenticated = true;
            state.initialized = true;
        },
        initializeAuthStatus: (state: AuthState) => {
            if (!logoutTimer) {
                let tokenString: string|null = localStorage.getItem("token");
                if (tokenString) {
                    let token: AccessToken = JSON.parse(tokenString);
                    state.accessToken = token;
                    state.isAuthenticated = true;
                    state.initialized = true;
                    initAuthStatusHandler();
                } else {
                    state.isAuthenticated = false;
                    state.accessToken = null;
                }
            }
        },
        resetAuthStatus: (state: AuthState) => {
            state.isAuthenticated = true;
            logoutHandler();
            console.log("********** Ath status reset *********");
            state.accessToken = null;
            state.isAuthenticated = false;
            state.initialized = false;
        }
    }
});

export const authActions = authSlice.actions;

export default authSlice;

