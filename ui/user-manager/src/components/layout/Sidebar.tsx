import {
  Box,
  List, ListItem,
  ListItemButton, ListItemText,
} from '@mui/material';
import { navMenuItems } from '../../constants/MenuConstants';

export default function Sidebar() {
  return (
    <Box flex={1} p={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
      <Box position="fixed">
        <List>
          {navMenuItems.map((item) => (
            <ListItem disablePadding key={item.key}>
              <ListItemButton component="a" href={item.navLink}>
                <ListItemText primary={item.value} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
