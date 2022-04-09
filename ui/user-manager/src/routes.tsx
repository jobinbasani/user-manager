
/*
JJ: Routes definition
*/

import { useRoutes } from "react-router-dom";
import NotFound from "./components/unspported/NotFound";
import Catechism from "./pages/public/Catechism";
import Committee from "./pages/public/Committee";
import Gallery from "./pages/public/Gallery";
import Home from "./pages/public/Home";
import JoinParish from "./pages/public/JoinParish";
import Login from "./pages/public/Login";
import Services from "./pages/public/Services";

const Router = () => {
    let element = useRoutes(
        [
            {path: "*", element: <NotFound />},
            {path: "/", element: <Home />},
            {path: "home", element: <Home />},
            {path: "committee", element: <Committee />},
            {path: "services", element: <Services/>},
            {path: "catechism", element: <Catechism/>},
            {path: "gallery", element: <Gallery/>},
            {path: "register", element: <JoinParish/>},
            {path: "login", element: <Login/>}
        ]
    );
    return element;
};

export default Router;
