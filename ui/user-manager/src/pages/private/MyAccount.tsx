import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../../store';

export default function MyAccount() {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      window.history.replaceState(null, '', '/myaccount');
    }
  }, [isLoggedIn]);

  return (
    <div>My Account</div>
  );
}
