import { AccessToken, getEmptyToken } from './api-types';

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