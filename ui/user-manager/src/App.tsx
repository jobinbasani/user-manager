import {BrowserRouter} from "react-router-dom";
import Router from './routes';

import './App.css';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/Footer';
import { useDispatch } from "react-redux";
import { doInit } from './store/auth/auth-action';

function App() {

  const dispatch = useDispatch();
  
  console.log("App initializing ....");
  dispatch(doInit());

  return (
    <div className="App">
      <BrowserRouter>
        <MainHeader/>
        <Router/>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
