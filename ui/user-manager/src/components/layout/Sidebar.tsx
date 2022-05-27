import { Box } from '@mui/material';
import MenuList from '../menu/MenuList';

export default function Sidebar() {
  return (
    <Box flex={1} p={2} sx={{ display: { xs: 'none', lg: 'block' } }}>
      <Box position="fixed">
        <MenuList />
      </Box>
    </Box>
  );
}
