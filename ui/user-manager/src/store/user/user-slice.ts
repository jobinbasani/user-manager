import { getEmptyUser } from './../../api/api-types';
import { User } from '../../api/api-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserDetails {
    userInfo: User;
    loading: 'idle' | 'pending' | 'success' | 'failed';
}

const initialUserInfo: UserDetails = {
                                        userInfo: getEmptyUser(), 
                                        loading: 'idle'
                                    };


const userSlice = createSlice({
    name: 'user',
    initialState: initialUserInfo,
    reducers: {
        getUserDetails: (state: UserDetails, action: PayloadAction<UserDetails>) => {
            let user: UserDetails = action.payload;
            state.userInfo.firstName = user.userInfo.firstName;
            state.userInfo.lastName = user.userInfo.lastName;
            state.userInfo.userEmail = user.userInfo.userEmail;
            localStorage.setItem("user", JSON.stringify(user));
            state.loading = 'success';
        }
    }
});

export const userActions = userSlice.actions;
export default userSlice;