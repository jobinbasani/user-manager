import axios, { AxiosRequestConfig } from "axios"
import { API_URL } from '../constants/ApiConstants';
import { authHeader } from './auth-header';
import { AxiosRequestHeaders } from 'axios';


export default class UserManagerApi {
    static apiHeader: AxiosRequestHeaders = authHeader();
    static requestConfig: AxiosRequestConfig = {headers: this.apiHeader};
    static headers = {
        headers: authHeader()
    }

    /** Get user details */
    static getUserDetails = async () => {
        console.dir(this.requestConfig);
        axios.get(API_URL+"user/profile", this.requestConfig).then((response) => {
            console.log(response);
            return response;
        }).catch(error => {
            console.log(error);
        }) ;
    }
}