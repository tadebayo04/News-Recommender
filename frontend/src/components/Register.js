import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! Please login.');
                navigate('/login');
            } else {
                alert(data.message || data.detail || 'Registration failed. Please try again.');
            }
        } catch (error) {
            alert('Connection error. Please check your internet connection and try again.');
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="register-form">
                <div className="name-row">
                    <div className="input-field">
                        <input 
                            type="text" 
                            placeholder="First Name" 
                            required 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="input-field">
                        <input 
                            type="text" 
                            placeholder="Last Name" 
                            required 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>
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
                        placeholder="Please enter your password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="input-field">
                    <input 
                        type="password" 
                        placeholder="Please confirm your password" 
                        required 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="create-account-btn">Create Account</button>
            </form>
            <div className="logo-section">
                <img src="/logo.png" alt="News System Logo" className="logo" />
                <h1 className="brand">NEWSSYSTEM</h1>
            </div>
        </div>
    );
}

export default Register;