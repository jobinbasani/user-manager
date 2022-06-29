import { useRoutes } from 'react-router-dom';
import Catechism from '../../pages/public/Catechism';
import Committee from '../../pages/public/Committee';
import Services from '../../pages/public/Services';
import LandingPage from '../../pages/public/LandingPage';
import Feed from '../feed/Feed';
import MyAccount from '../../pages/private/MyAccount';
import Admin from '../../pages/private/Admin';

const Router = () => useRoutes(
  [
    { path: '/', element: <Feed /> },
    { path: 'home', element: <Feed /> },
    { path: 'feed', element: <Feed /> },
    { path: 'myaccount', element: <MyAccount /> },
    { path: 'committee', element: <Committee /> },
    { path: 'services', element: <Services /> },
    { path: 'catechism', element: <Catechism /> },
    { path: 'admin', element: <Admin /> },
    { path: '*', element: <LandingPage /> },
  ],
);

export default Router;
