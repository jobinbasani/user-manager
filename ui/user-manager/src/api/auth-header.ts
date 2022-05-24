import { AxiosRequestHeaders } from 'axios';

/** Get jwt access token from local storage */

// eslint-disable-next-line import/prefer-default-export
export const authHeader = ():AxiosRequestHeaders => {
  const token: any = localStorage.getItem('token');
  let returnHeader = {};
  if (token) {
    returnHeader = {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }
  console.dir(returnHeader);
  return returnHeader;
};
