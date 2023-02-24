import React, { useEffect, useState } from 'react';
import { Home, Welcome, Auth, NewAccount } from './pages';
import { Routes, Route } from 'react-router-dom';
import { ExtensionService } from './services/Extension.service';
import { INIT } from './constants';
import './App.css';
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  const [inited, setInited] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(()=>{
    const init = async () => {
      const { status } = await ExtensionService.init();
      if(status === INIT)
        setInited(true);
      else
        setError('Extension services cant be initialized');
    }
    init()
        .catch(error => {
          setError(error)
          console.log(error);
        });
  },[])

  return (
    <div className="App">
      {!inited && error && <div>
        <h6>{error}</h6>
      </div>}
      { inited && !error ? (<Routes>
        <Route path={'/'} element={<Home/>}/>
        <Route path={'/welcome'} element={<Welcome/>} />
        <Route path={'/auth'} element={<Auth/>} />
        <Route path={'/newAccount'} element={<NewAccount/>} />
      </Routes>) : (<CircularProgress/>)
      }
    </div>
  );
}

export default App;
