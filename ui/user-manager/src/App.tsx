import {BrowserRouter} from "react-router-dom";
import Router from './routes';

import './App.css';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/Footer';

function App() {

  console.log("App initializing ....");

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
