/*
JJ: Routes definition
*/

import { useRoutes } from 'react-router-dom';
import Catechism from './pages/public/Catechism';
import Committee from './pages/public/Committee';
import Services from './pages/public/Services';
import LandingPage from './pages/public/LandingPage';
import Dashboard from './pages/private/Dashboard';
import Feed from './components/layout/Feed';
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
    { path: '*', element: <LandingPage /> },
  ],
);

export default Router;
