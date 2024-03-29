import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails, UserDetails } from '../../store/user/user-slice';
import { RootState } from '../../store';
import Feed from '../../components/feed/Feed';
import MyAccount from '../private/MyAccount';

export default function LandingPage() {
  const dispatch = useDispatch();
  const user:UserDetails = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(setUserDetails(window.location.href));
  }, [dispatch]);

  return (
    user.isLoggedIn ? <MyAccount /> : <Feed />
  );
}
