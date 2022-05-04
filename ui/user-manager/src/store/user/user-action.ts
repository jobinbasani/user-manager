import UserManagerApi from '../../api/api';

/** Fetch user details action */
export const getUserInfo = () => {
    return async (dispatch: any) => {
        let userData = await UserManagerApi.getUserDetails();
        console.dir(userData);
    }
}