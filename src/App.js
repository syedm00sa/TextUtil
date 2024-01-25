import { useState } from 'react';
import './App.css';
import About from './Components/About';
import Navbar from './Components/Navbar';
import TextForm from './Components/TextForm';
import Alert from './Components/Alert';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  const [mode, setMode]= useState('light');
  const [alert,setAlert] =useState(null);

  const showAlert = (message,type)=>{
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(()=>{
      setAlert(null);
    },3000);
  }

  const toggleMode = () => {
    if(mode==='light'){
      setMode('dark');
      document.body.style.backgroundColor='#042743'
      showAlert("Successfully changed to Dark mode","success");
    }else{
      setMode('light');
      document.body.style.backgroundColor='white'
      showAlert("Successfully changed to Light mode","success");
    }
  }

  return (
  <>
  <BrowserRouter>
    {/* <Navbar title="TextUtils" aboutText="About" home="Home"/> */}
    <Navbar title="TextUtils" mode={mode} toggleMode= {toggleMode}/>
    <div className="container my-3">
      <Alert alert={alert}/>
      <Routes>
          {/* <Route path="/about">
            <About />
          </Route> */}
          <Route exact path="/about" element={<About  mode={mode}/>}/>
          <Route exact path="/" element={<TextForm showAlert={showAlert} heading='Enter the text to analysis'  mode={mode}/>}/>
            {/* <TextForm showAlert={showAlert} heading='Enter the text to analysis'  mode={mode}/>
          </Route> */}
      </Routes>
    </div>
    </BrowserRouter>
   </>
  );
}

export default App;
