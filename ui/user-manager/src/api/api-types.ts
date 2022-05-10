

export interface AccessToken {
    userName: string ;
    idToken: string ;
    accessToken: string;
    expiresIn: number;
    tokenType: string;
    userInfo: User;
}

export interface User {
    userEmail: string;
    firstName: string;
    lastName: string;
}

/** Factory method to generate empty object since
 * reduxtoolkit doesn't lile classes as action params
 */
export const getEmptyToken = () => ({
    userName: '',
    idToken: '',
    accessToken: '',
    expiresIn: -1,
    tokenType: '',
    userInfo: {
        firstName: '',
        lastName: '',
        userEmail: ''
    }
});

export const getEmptyUser = () => ({
    firstName: '',
    lastName: '',
    userEmail: ''
})
