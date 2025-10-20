import React from 'react';
import { Login } from './screens';
import './App.css';

function App(): React.JSX.Element {
  const handleLogin = (email: string, password: string) => {
    console.log('Login realizado:', { email, password });
  };

  return (
    <div className="App">
      <Login onLogin={handleLogin} />
    </div>
  );
}

export default App;