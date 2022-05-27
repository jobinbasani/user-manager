import {
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';
import { navMenuItems } from '../../constants/MenuConstants';

export default function MenuList() {
  return (
    <List>
      {navMenuItems.map((item) => (
        <ListItem disablePadding key={item.key}>
          <ListItemIcon>
            <item.Icon />
          </ListItemIcon>
          <ListItemButton component="a" href={item.navLink}>
            <ListItemText primary={item.value} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
