import { User } from '../../api/api-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';

export interface UserDetails {
    isLoggedIn:boolean
    userInfo: User;
}

const userSlice = createSlice({
    name: 'user',
    initialState: ({
        isLoggedIn:false,
        userInfo: ({
            firstName: '',
            lastName: '',
            userEmail: ''
        }),
    }),
    reducers: {
        setUserDetails: (state: UserDetails,action:PayloadAction<string>)=>{
            const idTokenPattern = /id_token=([\w-]+\.[\w-]+\.[\w-]+)/ig;
            const matches = idTokenPattern.exec(action.payload);
            if (matches && matches.length > 1) {
                state.isLoggedIn = true;
                const decoded: any = jwtDecode(matches[1]);
                if (decoded) {
                    if (decoded["email"]) {
                        state.userInfo.userEmail = decoded["email"]
                    }
                    if (decoded["given_name"] && decoded["family_name"]) {
                        state.userInfo.firstName = decoded["given_name"];
                        state.userInfo.lastName = decoded["family_name"];
                    }
                }
            }
        }
    }
});

export const {setUserDetails} = userSlice.actions;

export default userSlice.reducer;
