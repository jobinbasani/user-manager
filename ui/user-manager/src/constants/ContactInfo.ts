import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import SvgIcon from '@mui/material/SvgIcon/SvgIcon';

export interface ContactInfo{
  key: string;
  Image: typeof SvgIcon;
  link: string;
}

export const ContactInfoItems: Array<ContactInfo> = [
  {
    key: '1', Image: FacebookIcon, link: 'https://www.facebook.com/groups/1003089003043538',
  },
  {
    key: '2', Image: InstagramIcon, link: 'https://instagram.com',
  },
];
