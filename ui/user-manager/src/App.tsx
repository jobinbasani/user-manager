import './App.css';

import { Box, Stack } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Sidebar from './components/layout/Sidebar';
import Feed from './components/layout/Feed';
import Rightbar from './components/layout/Rightbar';
import Navbar from './components/layout/Navbar';

function App() {
  return (
  /*     <div className="App">
      <BrowserRouter>
        <MainHeader />
        <Router />
        <Footer />
      </BrowserRouter>
    </div> */
    <Box>
      <Navbar />
      <Box sx={{ flexGrow: 1 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
          <Sidebar />
          <Feed />
          <Rightbar />
        </Stack>
      </Box>
      <Container sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontSize: 12, paddingBottom: 2 }}>&copy; Holy Family Syro Malabar Church</Typography>
      </Container>
    </Box>
  );
}

export default App;
