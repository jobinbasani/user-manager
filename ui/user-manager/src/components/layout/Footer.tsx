import {
  BottomNavigation,
  BottomNavigationAction,
  Box, Drawer,
  Paper,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from 'react';
import MenuList from '../menu/MenuList';

export default function Footer() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown'
          && ((event as React.KeyboardEvent).key === 'Tab'
            || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: 'block', lg: 'none' },
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
      >
        <BottomNavigationAction
          sx={{
            '& .MuiBottomNavigationAction-label': {
              fontWeight: 'bold',
            },
          }}
          label="Menu"
          icon={<MenuIcon color="primary" />}
          onClick={toggleDrawer(true)}
        />
      </BottomNavigation>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <MenuList />
        </Box>
      </Drawer>
    </Paper>
  );
}
