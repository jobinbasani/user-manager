import ComingSoon from "../../components/unspported/ComingSoon";
import { useSelector} from 'react-redux';
import { RootState } from '../../store';
import { useEffect } from 'react';

const Dashboard = () => {

    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

    useEffect(()=>{
        if (isLoggedIn) {
            window.history.replaceState(null, '', '/dashboard');
        }
    },[isLoggedIn]);

    return(
        <div>
            <ComingSoon />
        </div>
    );

}

export default Dashboard;
