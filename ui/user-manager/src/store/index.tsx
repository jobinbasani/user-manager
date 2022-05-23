
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth-slice';
import userSlice from './user/user-slice';


const store = configureStore({
    reducer: {
               auth: authReducer,
               user: userSlice.reducer
            },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
