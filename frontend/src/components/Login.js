import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Login successful!');
                navigate('/home');
            } else {
                alert(typeof data.detail === 'string' ? data.detail : 'Login failed. Please try again.');
            }
        } catch (error) {
            alert('Connection error. Please check your internet connection and try again.');
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="login-form">
                <div className="input-field">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-field">
                    <input 
                        type="password" 
                        placeholder="Password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="login-btn">Login</button>
            </form>
            <div className="logo-section">
                <img src="/logo.png" alt="News System Logo" className="logo" />
                <h1 className="brand">NEWSSYSTEM</h1>
            </div>
        </div>
    );
}

export default Login;