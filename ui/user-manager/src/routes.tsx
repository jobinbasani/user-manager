/*
JJ: Routes definition
*/

import { useRoutes } from 'react-router-dom';
import Unauthorized from './components/unspported/Unauthorized';
import Catechism from './pages/public/Catechism';
import Committee from './pages/public/Committee';
import Gallery from './pages/public/Gallery';
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import Register from './pages/public/Register';
import LandingPage from './pages/public/LandingPage';
import Dashboard from './pages/private/Dashboard';

const Router = () => useRoutes(
  [
    { path: 'home', element: <Home /> },
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'committee', element: <Committee /> },
    { path: 'services', element: <Services /> },
    { path: 'catechism', element: <Catechism /> },
    { path: 'gallery', element: <Gallery /> },
    { path: 'register', element: <Register /> },
    { path: 'unauthorized', element: <Unauthorized /> },
    { path: '*', element: <LandingPage /> },
  ],
);

export default Router;
