import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NewsFeed from './components/NewsFeed';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';  // Make sure to import the CSS

function App() {
  return (
    <Router>
      <div className="App">
        <h1 className="app-title">News Recommendation System</h1>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<NewsFeed />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;