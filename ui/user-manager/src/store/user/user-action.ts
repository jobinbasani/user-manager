import { getUserDetails } from '../../api/api';

/** Fetch user details action */
export const getUserInfo = () => {
    return async (dispatch: any) => {
        let userData = await getUserDetails();
        console.dir(userData);
    }
}