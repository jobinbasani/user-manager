import { AxiosRequestHeaders } from 'axios';

/** Get jwt access token from local storage */

export const authHeader = ():AxiosRequestHeaders => {
    let token: any = localStorage.getItem("token");
    let returnHeader = {};
    if (token) {
      returnHeader = {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      };
    }
    console.dir(returnHeader);
    return returnHeader;
}
