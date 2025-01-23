import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import NewsFeed from './components/NewsFeed';
import Register from './components/Register';
import Login from './components/Login';
import Interests from './components/Interests';
import './App.css';  // Make sure to import the CSS

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Optionally, clear any user data from local storage or context
  };

  return (
    <Router>
      <div className="App">
        <h1 className="app-title">News Recommendation System</h1>
        <div className="content">
          <nav className="sidebar">
            <ul>
              {isAuthenticated ? (
                <>
                  <li><Link to="/home">Home</Link></li>
                  <li><Link to="/interests">Interests</Link></li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/register">Register</Link></li>
                  <li><Link to="/login">Login</Link></li>
                </>
              )}
            </ul>
          </nav>
          <div className="main">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={isAuthenticated ? <NewsFeed /> : <Navigate to="/register" />} />
              <Route path="/register" element={isAuthenticated ? <Navigate to="/home" /> : <Register />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/interests" element={isAuthenticated ? <Interests /> : <Navigate to="/register" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
