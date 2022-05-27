/*
JJ: Routes definition
*/

import { useRoutes } from 'react-router-dom';
import Unauthorized from './components/unspported/Unauthorized';
import Catechism from './pages/public/Catechism';
import Committee from './pages/public/Committee';
import Gallery from './pages/public/Gallery';
import Services from './pages/public/Services';
import Register from './pages/public/Register';
import LandingPage from './pages/public/LandingPage';
import Dashboard from './pages/private/Dashboard';
import Feed from './components/layout/Feed';
import Logout from './pages/private/Logout';
import MyAccount from './pages/private/MyAccount';

const Router = () => useRoutes(
  [
    { path: '/', element: <Feed /> },
    { path: 'home', element: <Feed /> },
    { path: 'feed', element: <Feed /> },
    { path: 'myaccount', element: <MyAccount /> },
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'committee', element: <Committee /> },
    { path: 'services', element: <Services /> },
    { path: 'catechism', element: <Catechism /> },
    { path: 'gallery', element: <Gallery /> },
    { path: 'register', element: <Register /> },
    { path: 'unauthorized', element: <Unauthorized /> },
    { path: 'logout', element: <Logout /> },
    { path: '*', element: <LandingPage /> },
  ],
);

export default Router;
