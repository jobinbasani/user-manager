import ComingSoon from "../../components/unspported/ComingSoon";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/index';
import { useEffect } from 'react';
import { getUserInfo } from '../../store/user/user-action';

const Dashboard = () => {

    const authStatus = useSelector((state: RootState) => state.auth.isAuthenticated);

    const dispatch = useDispatch();

    useEffect(()=>{
        if (authStatus) {
            console.log("Dashboard #### ---is authenticated ....");
            dispatch(getUserInfo());
        }
    },[authStatus, dispatch]);

    return(
        <div>
            <ComingSoon />
        </div>
    );

}

export default Dashboard;