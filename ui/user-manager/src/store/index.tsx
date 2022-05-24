
import { configureStore } from '@reduxjs/toolkit';
import auth from './auth/auth-slice';
import user from './user/user-slice';


const store = configureStore({
    reducer: {
               auth,
               user
            },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
