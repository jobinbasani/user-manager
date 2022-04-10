import {BrowserRouter} from "react-router-dom";
import Router from './routes';

import './App.css';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/Footer';
import { Container } from "@mui/material";

function App() {
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
