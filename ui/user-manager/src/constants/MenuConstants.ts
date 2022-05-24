import { LOGIN_URL } from './ApiConstants';

export interface NavMenuItemType {
  key: string;
  value: string;
  navLink: string;
  isPrivate: boolean;
}

/** Main header navigation items */
export const navMenuItems: Array<NavMenuItemType> = [
  {
    key: '1', value: 'Home', navLink: '/', isPrivate: false,
  },
  {
    key: '2', value: 'Services', navLink: '/services', isPrivate: false,
  },
  {
    key: '3', value: 'Committee', navLink: '/committee', isPrivate: false,
  },
  {
    key: '4', value: 'Catechism', navLink: '/catechism', isPrivate: false,
  },
  {
    key: '5', value: 'Gallery', navLink: '/gallery', isPrivate: false,
  },
  {
    key: '6', value: 'Register', navLink: '/register', isPrivate: false,
  },
  {
    key: '7', value: 'Login', navLink: LOGIN_URL, isPrivate: false,
  },
];

/** Main header right menu items */
export const rightMenuItems = [
  { key: '1', value: 'Dashboard', navLink: '/dashboard' },
  { key: '2', value: 'Logout', navLink: '/' },
];
