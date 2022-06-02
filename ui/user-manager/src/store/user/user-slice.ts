import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';

export interface User {
  userEmail: string;
  firstName: string;
  lastName: string;
}

export interface UserDetails {
  isLoggedIn: boolean
  isApproved:boolean
  isAdmin:boolean
  accessToken: string
  userInfo: User;
}

function getTokenValueFromURL(param: string, inputString: string) {
  const tokenRegexp = new RegExp(`${param}=([\\w-]+\\.[\\w-]+\\.[\\w-]+)`, 'ig');
  const matches = tokenRegexp.exec(inputString);
  if (matches && matches.length > 1) {
    return matches[1];
  }
  return null;
}

const userSlice = createSlice({
  name: 'user',
  initialState: ({
    isLoggedIn: false,
    isApproved: false,
    isAdmin: false,
    accessToken: '',
    userInfo: ({
      firstName: '',
      lastName: '',
      userEmail: '',
    }),
  }),
  reducers: {
    setUserDetails: (state: UserDetails, action: PayloadAction<string>) => {
      const idToken = getTokenValueFromURL('id_token', action.payload);
      const accessToken = getTokenValueFromURL('access_token', action.payload);
      if (idToken) {
        state.isLoggedIn = true;
        const decoded: any = jwtDecode(idToken);
        if (decoded) {
          if (decoded['custom:approved_user']) {
            state.isApproved = decoded['custom:approved_user'] === 'true';
          }
          if (decoded['cognito:groups']) {
            state.isAdmin = decoded['cognito:groups'].includes('admin');
          }
          if (decoded.email) {
            state.userInfo.userEmail = decoded.email;
          }
          if (decoded.given_name && decoded.family_name) {
            state.userInfo.firstName = decoded.given_name;
            state.userInfo.lastName = decoded.family_name;
          }
        }
      }
      if (accessToken) {
        state.accessToken = accessToken;
        localStorage.setItem('token', accessToken);
      }
    },
  },
});

export const { setUserDetails } = userSlice.actions;

export default userSlice.reducer;
