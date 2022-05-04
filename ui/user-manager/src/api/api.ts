import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios"
import { API_URL } from '../constants/ApiConstants';
import { authHeader } from './auth-header';


const getApiHeader = (): AxiosRequestConfig => {
    const apiHeader: AxiosRequestHeaders = authHeader();
    const requestConfig: AxiosRequestConfig = {headers: apiHeader};

    return requestConfig;
}


/** Get user details */
 export const getUserDetails = async () => {
    let header = getApiHeader();
    console.dir(header);
    axios.get(API_URL+"user/profile", header).then((response) => {
        console.log(response);
        return response;
    }).catch(error => {
        console.log(error);
    }) ;
 }
