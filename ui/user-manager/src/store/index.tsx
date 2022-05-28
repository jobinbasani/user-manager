import { configureStore } from '@reduxjs/toolkit';
import user from './user/user-slice';
import family from './family/family-slice';

const store = configureStore({
  reducer: {
    user,
    family,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
