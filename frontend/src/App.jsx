import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(null);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {token ? (
        <Dashboard token={token} onLogout={() => setToken(null)} />
      ) : (
        <Login onLogin={(t) => setToken(t)} />
      )}
    </div>
  );
}

export default App;
