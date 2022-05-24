/*
JJ: Routes definition
*/

import {useSelector} from "react-redux";
import {Navigate, useRoutes} from "react-router-dom";
import Unauthorized from "./components/unspported/Unauthorized";
import Dashboard from "./pages/private/Dashboard";
import Catechism from "./pages/public/Catechism";
import Committee from "./pages/public/Committee";
import Gallery from "./pages/public/Gallery";
import Home from "./pages/public/Home";
import Services from "./pages/public/Services";
import {RootState} from './store/index';
import Register from './pages/public/Register';
import LandingPage from "./pages/public/LandingPage";

const Router = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isAuthenticated);

  return useRoutes(
        [
          {path: "/", element: <Home />},
          {path: "home", element: <Home/>},
          {path: "committee", element: <Committee/>},
          {path: "services", element: <Services/>},
          {path: "catechism", element: <Catechism/>},
          {path: "gallery", element: <Gallery/>},
          {path: "register", element: <Register/>},
          {path: "unauthorized", element: <Unauthorized/>},
          {path: "dashboard", element: isLoggedIn ? <Dashboard/> : <Navigate to="/home"/>},
          {path: "*", element: <LandingPage/>},
        ]
    );
};

export default Router;
