import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('rover_token'));

  const handleLogin = (t) => {
    localStorage.setItem('rover_token', t);
    setToken(t);
  };

  const handleLogout = () => {
    localStorage.removeItem('rover_token');
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {token ? (
        <Dashboard token={token} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
