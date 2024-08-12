import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import logo from './Logo.png';
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(()=> {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          LOGIN OR SIGN UP!
        </p>
      </header>
      <div className="form-wrapper">
        <div className="form-container">
          <Login />
        </div>
        <div className="divider"></div>
        <div className="form-container">
          <Signup />
        </div>
      </div>
    </div>
  );
}

export default App;
