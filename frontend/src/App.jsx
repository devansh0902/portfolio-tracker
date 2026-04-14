import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/login" 
          element={token ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/register" 
          element={token ? <Navigate to="/dashboard" /> : <Register />} 
        />
        <Route 
          path="/dashboard" 
          element={token ? <Dashboard token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
