import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';
import { User } from '../../api/api-types';

export interface UserDetails {
  isLoggedIn: boolean
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
    logoutUser: (state: UserDetails) => {
      state.isLoggedIn = false;
      state.accessToken = '';
      state.userInfo = { firstName: '', lastName: '', userEmail: '' };
      localStorage.removeItem('token');
    },
  },
});

export const { setUserDetails, logoutUser } = userSlice.actions;

export default userSlice.reducer;
