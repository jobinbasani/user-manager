import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Footer() {
  return (
    <>
      <Container sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontSize: 12, paddingBottom: 2 }}>&copy; Holy Family Syro Malabar Church</Typography>
      </Container>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: { xs: 'block', sm: 'none' },
        }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
        >
          <BottomNavigationAction label="Menu" icon={<MenuIcon />} />
        </BottomNavigation>
      </Paper>
    </>
  );
}
