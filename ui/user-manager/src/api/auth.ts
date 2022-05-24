export class UserAuth {

    /**
     * Decode token from url
     */
    static  getAccessTokenFromUrl(urlQuery: string): string | null  {
        let accessToken: string = '';
        const accessTokenPattern = /access_token=([\w-]+\.[\w-]+\.[\w-]+)/ig;
        const matches = accessTokenPattern.exec(urlQuery);
        if (matches && matches.length > 1) {
            accessToken = matches[1];
        }
        return accessToken;
    }
}
