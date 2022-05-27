import SvgIcon from '@mui/material/SvgIcon/SvgIcon';
import HomeIcon from '@mui/icons-material/Home';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CollectionsIcon from '@mui/icons-material/Collections';
import GroupIcon from '@mui/icons-material/Group';
import BookIcon from '@mui/icons-material/Book';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LoginIcon from '@mui/icons-material/Login';
import { LOGIN_URL, SIGNUP_URL } from './ApiConstants';

export interface NavMenuItemType {
  key: string;
  value: string;
  navLink: string;
  isPrivate: boolean;
  Icon: typeof SvgIcon
  visibility: 'all'|'loggedout'|'loggedin'
}

/** Main header navigation items */
export const navMenuItems: Array<NavMenuItemType> = [
  {
    key: '1', value: 'Home', navLink: '/', isPrivate: false, Icon: HomeIcon, visibility: 'all',
  },
  {
    key: '2', value: 'Services', navLink: '/services', isPrivate: false, Icon: RoomServiceIcon, visibility: 'all',
  },
  {
    key: '3', value: 'Committee', navLink: '/committee', isPrivate: false, Icon: GroupIcon, visibility: 'all',
  },
  {
    key: '4', value: 'Catechism', navLink: '/catechism', isPrivate: false, Icon: BookIcon, visibility: 'all',
  },
  {
    key: '5', value: 'Gallery', navLink: '/gallery', isPrivate: false, Icon: CollectionsIcon, visibility: 'all',
  },
  {
    key: '6', value: 'Sign Up', navLink: SIGNUP_URL, isPrivate: false, Icon: HowToRegIcon, visibility: 'loggedout',
  },
  {
    key: '7', value: 'Login', navLink: LOGIN_URL, isPrivate: false, Icon: LoginIcon, visibility: 'loggedout',
  },
  {
    key: '8', value: 'My Account', navLink: '/myaccount', isPrivate: false, Icon: AccountBoxIcon, visibility: 'loggedin',
  },
  {
    key: '9', value: 'Logout', navLink: '/logout', isPrivate: false, Icon: LogoutIcon, visibility: 'loggedin',
  },
];

/** Main header right menu items */
export const rightMenuItems = [
  { key: '1', value: 'Dashboard', navLink: '/dashboard' },
  { key: '2', value: 'Logout', navLink: '/' },
];
