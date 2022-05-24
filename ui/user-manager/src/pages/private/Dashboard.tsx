import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import ComingSoon from '../../components/unspported/ComingSoon';
import { RootState } from '../../store';

function Dashboard() {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      window.history.replaceState(null, '', '/dashboard');
    }
  }, [isLoggedIn]);

  return (
    <div>
      <ComingSoon />
    </div>
  );
}

export default Dashboard;
