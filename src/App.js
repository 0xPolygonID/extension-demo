import React, { useEffect, useState } from 'react';
import { Home, Welcome, Auth, NewAccount } from './pages';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { CircuitStorageInstance } from './services';

function App() {
  const [account, setAccount] = useState(null);
  
  useEffect(()=>{
    CircuitStorageInstance.init();
  },[])

  useEffect(()=>{
    window.addEventListener('storage', () => {
      console.log("Change to local storage!");
      let accounts = localStorage.getItem('accounts');
      setAccount(accounts);
      
    })
    let accounts = localStorage.getItem('accounts')
    setAccount(accounts);
    // if(chrome.storage) { // OLD version
    //   chrome.storage.sync.get('account', function(result){
    //     // console.log('result', result);
    //     setAccount(result.account)
    //   });
    // }
    // if(chrome.storage)
    //   chrome.storage.onChanged.addListener((changes, namespace) => {
    //     for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    //       if(key === 'account')
    //         setAccount(newValue);
    //       console.log(
    //           `Storage key "${key}" in namespace "${namespace}" changed.`,
    //           `Old value was "${oldValue}", new value is "${newValue}".`
    //       );
    //     }
    // })
    
  },[]);
    return (
    <div className="App">
      <Routes>
        <Route path={'/'} element={account ? <Home account={account}/> : <Welcome/>} />
        <Route path={'/welcome'} element={<Welcome/>} />
        <Route path={'/auth'} element={<Auth/>} />
        <Route path={'/newAccount'} element={<NewAccount/>} />
      </Routes>
    </div>
  );
}

export default App;
