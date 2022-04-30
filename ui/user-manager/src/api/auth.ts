import { AccessToken, getEmptyToken } from './api-types';
import jwtDecode from "jwt-decode";

export class UserAuth {

    /** 
     * Decode token from url
     */
    static  getAccessTokenFromUrl(urlQuery: string): AccessToken | null  {
        let accessToken: AccessToken = getEmptyToken();
    
        let splitUrl = urlQuery.split("#");
        if (splitUrl && splitUrl.length > 1) {
            let splitted = splitUrl[1].split("&");
            if (splitted && splitted.length > 1) {
                for (let item of splitted) {
                    let factors = item.split("=");
                    switch (factors[0]) {
                        case "id_token":
                            accessToken.idToken = factors[1];
                            const decoded: any = jwtDecode(accessToken.idToken);
                            if (decoded) {
                                if (decoded["email"]) {
                                    accessToken.userInfo.userEmail = decoded["email"]
                                }
                                if (decoded["given_name"] && decoded["family_name"]) {
                                    accessToken.userInfo.firstName = decoded["given_name"];
                                    accessToken.userInfo.lastName = decoded["family_name"];
                                }
                            }
                            break;
    
                        case "access_token":
                            accessToken.accessToken = factors[1];
                            break;
    
                        case "expires_in":
                            accessToken.expiresIn = parseInt(factors[1]);
                            break;
    
                        case "token_type":
                            accessToken.tokenType = factors[1];
                            break;
                    }
                }
            }
        }
        
        return accessToken;
    }
}