import { AccessToken, getEmptyToken } from './api-types';
import jwtDecode, { JwtPayload } from "jwt-decode";

export class UserAuth {

    static  getAccessTokenFromUrl(urlQuery: string): AccessToken | null  {
        let accessToken: AccessToken = getEmptyToken();
    
        let replaceFirstHash = urlQuery.replace("#", "");
        let splitted = replaceFirstHash.split("&");

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
    
        return accessToken;
    }
}