import {
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { navMenuItems } from '../../constants/MenuConstants';
import { UserDetails } from '../../store/user/user-slice';
import { RootState } from '../../store';

export default function MenuList() {
  const user:UserDetails = useSelector((state: RootState) => state.user);

  return (
    <List>
      {navMenuItems.filter((item) => (
        item.visibility === 'all'
        || (user.isLoggedIn && item.visibility === 'loggedin')
        || (!user.isLoggedIn && item.visibility === 'loggedout')
      ))
        .map((item) => (
          <ListItem key={item.key} sx={{ paddingLeft: 1 }}>
            <ListItemIcon sx={{ paddingRight: 0 }}>
              <item.Icon />
            </ListItemIcon>
            {item.navLink.startsWith('https://')
              ? (
                <ListItemButton component="a" href={item.navLink} sx={{ paddingLeft: 0 }}>
                  <ListItemText primary={item.value} />
                </ListItemButton>
              )
              : (
                <ListItemButton component={Link} to={item.navLink} sx={{ paddingLeft: 0 }}>
                  <ListItemText primary={item.value} />
                </ListItemButton>
              )}
          </ListItem>
        ))}
    </List>
  );
}
