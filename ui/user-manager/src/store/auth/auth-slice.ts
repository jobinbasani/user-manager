
import { createSlice} from '@reduxjs/toolkit';
import {UserAuth} from "../../api/auth";

interface AuthState {
    isAuthenticated: boolean;
    accessToken: string | null | undefined;
}

function getInitialState(): AuthState {
    const token:string | null = UserAuth.getAccessTokenFromUrl(window.location.href);
    if (token && token.length > 0) {
        localStorage.setItem("token", token);
        return {
            isAuthenticated: true,
            accessToken: token
        }
    }
    return {
        isAuthenticated: false,
        accessToken: null
    }
}

const authSlice = createSlice({
    name: 'authentication',
    initialState: getInitialState(),
    reducers: {
        resetAuthStatus: (state: AuthState) => {
            state.accessToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
        }
    }
});

export const {resetAuthStatus} = authSlice.actions;

export default authSlice.reducer;

