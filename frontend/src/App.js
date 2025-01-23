import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NewsFeed from './components/NewsFeed';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>News Recommendation System</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<NewsFeed />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;