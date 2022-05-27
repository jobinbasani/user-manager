import {
  List, ListItem, ListItemButton, ListItemText,
} from '@mui/material';
import { navMenuItems } from '../../constants/MenuConstants';

export default function MenuList() {
  return (
    <List>
      {navMenuItems.map((item) => (
        <ListItem disablePadding key={item.key}>
          <ListItemButton component="a" href={item.navLink}>
            <ListItemText primary={item.value} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
