import {
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';
import { navMenuItems } from '../../constants/MenuConstants';

export default function MenuList() {
  return (
    <List>
      {navMenuItems.map((item) => (
        <ListItem key={item.key} sx={{ paddingLeft: 1 }}>
          <ListItemIcon sx={{ paddingRight: 0 }}>
            <item.Icon />
          </ListItemIcon>
          <ListItemButton component="a" href={item.navLink} sx={{ paddingLeft: 0 }}>
            <ListItemText primary={item.value} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
