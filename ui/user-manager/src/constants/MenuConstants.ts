import SvgIcon from '@mui/material/SvgIcon/SvgIcon';
import HomeIcon from '@mui/icons-material/Home';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CollectionsIcon from '@mui/icons-material/Collections';
import GroupIcon from '@mui/icons-material/Group';
import BookIcon from '@mui/icons-material/Book';
import LoginIcon from '@mui/icons-material/Login';
import { LOGIN_URL } from './ApiConstants';

export interface NavMenuItemType {
  key: string;
  value: string;
  navLink: string;
  isPrivate: boolean;
  Icon: typeof SvgIcon
}

/** Main header navigation items */
export const navMenuItems: Array<NavMenuItemType> = [
  {
    key: '1', value: 'Home', navLink: '/', isPrivate: false, Icon: HomeIcon,
  },
  {
    key: '2', value: 'Services', navLink: '/services', isPrivate: false, Icon: RoomServiceIcon,
  },
  {
    key: '3', value: 'Committee', navLink: '/committee', isPrivate: false, Icon: GroupIcon,
  },
  {
    key: '4', value: 'Catechism', navLink: '/catechism', isPrivate: false, Icon: BookIcon,
  },
  {
    key: '5', value: 'Gallery', navLink: '/gallery', isPrivate: false, Icon: CollectionsIcon,
  },
  {
    key: '6', value: 'Register', navLink: '/register', isPrivate: false, Icon: HowToRegIcon,
  },
  {
    key: '7', value: 'Login', navLink: LOGIN_URL, isPrivate: false, Icon: LoginIcon,
  },
];

/** Main header right menu items */
export const rightMenuItems = [
  { key: '1', value: 'Dashboard', navLink: '/dashboard' },
  { key: '2', value: 'Logout', navLink: '/' },
];
