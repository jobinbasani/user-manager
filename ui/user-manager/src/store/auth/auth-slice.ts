
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../api/auth-header';

interface AuthState {
    isAuthenticated: boolean;
    currentUser: User | null | undefined;
};

const initialAuthState: AuthState = {
    isAuthenticated: false,
    currentUser: null
};

const authSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthState,
    reducers: {
        setAuthenticated: (state: AuthState, action: PayloadAction<User>) => {
            state.isAuthenticated = true;
            let user: User = action.payload;
            localStorage.setItem("user", JSON.stringify(user));
            console.log("******** Authentication action: " + user.email + user.accessToken+" ***********");
            state.currentUser = user;
        },
        resetAuthStatus: (state: AuthState) => {
            state.isAuthenticated = false;
            localStorage.removeItem("user");
            console.log("********** Ath status reset *********");
            state.currentUser = null;
        }
    }
});

export const authActions = authSlice.actions;

export default authSlice;

