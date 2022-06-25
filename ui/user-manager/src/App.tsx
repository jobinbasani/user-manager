import './App.css';

import {
  Box, Stack,
} from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Rightbar from './components/layout/Rightbar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Router from './routes';

function App() {
  return (
    <Box>
      <BrowserRouter>
        <Navbar />
        <Box sx={{ flexGrow: 1, bgcolor: '#F0F2F5' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
            <Sidebar />
            <Router />
            <Rightbar />
          </Stack>
        </Box>
        <Footer />
      </BrowserRouter>
    </Box>
  );
}

export default App;
