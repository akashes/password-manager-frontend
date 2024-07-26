import './App.css';
import Home from './Components/Home';
import Header from './Components/Header';
import { ToastContainer } from 'react-toastify';
function App() {
  return (
      <div className="App ">
                 <Header/>

        <Home/>
        <ToastContainer/>
        </div>
  );
}

export default App;
