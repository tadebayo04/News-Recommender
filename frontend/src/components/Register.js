import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
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
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/register', {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password
            });

            if (response.status === 200) {
                alert('Registration successful! Please login.');
                navigate('/login');
            }
        } catch (error) {
            setError(error.response?.data?.detail || 'Registration failed. Please try again.');
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
                    <h1>Create Account</h1>
                    <p>Join us to get personalized news recommendations</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="name-row">
                        <div className="input-field">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-field">
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
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
                            placeholder="Create Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <div className="password-requirements">
                            Password must be at least 8 characters long
                        </div>
                    </div>
                    <div className="input-field">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="terms-checkbox">
                        <input
                            type="checkbox"
                            id="terms"
                            required
                        />
                        <label htmlFor="terms">
                            I agree to the Terms of Service and Privacy Policy
                        </label>
                    </div>

                    <button type="submit" className="auth-button">
                        Create Account
                    </button>
                </form>

                <div className="auth-links">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;