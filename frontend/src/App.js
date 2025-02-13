import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Interests from './components/Interests';
import PersonalizedNews from './components/PersonalizedNews';
import HomePage from './components/HomePage';
import './App.css';  // Make sure to import the CSS

// Create a wrapper component that uses useLocation
function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in on component mount
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Clear user data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
  };

  return (
    <div className="App">
      <h1 className="app-title">
        <span role="img" aria-label="newspaper">📰</span> News Recommendation System
      </h1>
      <div className="content">
        <nav className="sidebar">
          {isAuthenticated && (
            <div className="user-info">
              <div className="user-name">
                {localStorage.getItem('firstName')} {localStorage.getItem('lastName')}
              </div>
              <div className="user-email">{localStorage.getItem('userEmail')}</div>
            </div>
          )}
          
          <ul className="nav-links">
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
                    <span role="img" aria-label="home">🏠</span>
                    <span className="link-text">Home</span>
                  </Link>
                </li>
                <li>
                  <Link to="/interests" className={location.pathname === '/interests' ? 'active' : ''}>
                    <span role="img" aria-label="magnifying glass">🔍</span>
                    <span className="link-text">Interests</span>
                  </Link>
                </li>
                <li>
                  <Link to="/personalized-news" className={location.pathname === '/personalized-news' ? 'active' : ''}>
                    <span role="img" aria-label="pushpin">📌</span>
                    <span className="link-text">Recommended</span>
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout}>
                    <span role="img" aria-label="logout">🚪</span>
                    <span className="link-text">Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>
                    <span role="img" aria-label="memo">📝</span>
                    <span className="link-text">Register</span>
                  </Link>
                </li>
                <li>
                  <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                    <span role="img" aria-label="key">🔑</span>
                    <span className="link-text">Login</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/home" /> : <Register />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/interests" element={isAuthenticated ? <Interests /> : <Navigate to="/register" />} />
            <Route path="/personalized-news" element={isAuthenticated ? <PersonalizedNews /> : <Navigate to="/register" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// Main App component that provides the Router context
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
