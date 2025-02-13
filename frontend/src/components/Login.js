import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/login', formData);
            
            localStorage.setItem('userId', response.data.id);
            localStorage.setItem('userEmail', response.data.email);
            localStorage.setItem('firstName', response.data.first_name);
            localStorage.setItem('lastName', response.data.last_name);
            
            setIsAuthenticated(true);
            navigate('/home');
        } catch (error) {
            setError(error.response?.data?.detail || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="brand-section">
                    <img src="/logo.png" alt="Logo" className="brand-logo" />
                    <div className="brand-name">NEWS SYSTEM</div>
                </div>

                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue to your feed</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-field">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-field">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Sign In</button>
                </form>

                <div className="auth-links">
                    <p>Don't have an account? <Link to="/register">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;