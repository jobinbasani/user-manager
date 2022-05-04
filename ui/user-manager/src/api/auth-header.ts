import { AxiosRequestHeaders } from 'axios';
import { AccessToken } from './api-types';

/** Get jwt access token from local storage */

export const authHeader = ():AxiosRequestHeaders => {
    let tokenObject: any = localStorage.getItem("token");
    let returnHeader = {};
    if (tokenObject) {
        const token: AccessToken = JSON.parse(tokenObject);
        if (token && token.accessToken) {
            returnHeader = {
                    "accept": "application/json",
                    "Authorization": "Bearer "+token.accessToken
                   };
        }
    }
    console.dir(returnHeader);
    return returnHeader;
}