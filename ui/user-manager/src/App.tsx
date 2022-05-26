import './App.css';

import { Box, Stack } from '@mui/material';
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
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Sidebar />
        <Feed />
        <Rightbar />
      </Stack>
    </Box>
  );
}

export default App;
