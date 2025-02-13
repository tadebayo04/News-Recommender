import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const isLoggedIn = localStorage.getItem('userId');

    return (
        <div className="homepage">
            <div className="hero-section">
                <h1>
                    <span className="icon" role="img" aria-label="newspaper">📰</span>
                    Your Personalized News Hub
                </h1>
                <p className="subtitle">Stay informed with news that matters to you</p>
            </div>

            <div className="features-grid">
                <div className="feature-card">
                    <span className="feature-icon" role="img" aria-label="target">🎯</span>
                    <h3>Personalized Feed</h3>
                    <p>Get news tailored to your interests and preferences</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon" role="img" aria-label="magnifying glass">🔍</span>
                    <h3>Smart Recommendations</h3>
                    <p>Discover relevant articles based on your reading history</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon" role="img" aria-label="lightning">⚡</span>
                    <h3>Real-time Updates</h3>
                    <p>Stay up-to-date with the latest news as it happens</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon" role="img" aria-label="globe">🌐</span>
                    <h3>Global Coverage</h3>
                    <p>Access news from trusted sources worldwide</p>
                </div>
            </div>

            <div className="cta-section">
                {!isLoggedIn ? (
                    <div className="auth-buttons">
                        <Link to="/register" className="cta-button register">
                            Get Started
                        </Link>
                        <Link to="/login" className="cta-button login">
                            Sign In
                        </Link>
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <Link to="/interests" className="cta-button">
                            Update Interests
                        </Link>
                        <Link to="/personalized-news" className="cta-button">
                            View Recommendations
                        </Link>
                    </div>
                )}
            </div>

            <div className="how-it-works">
                <h2>How It Works</h2>
                <div className="steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Create Account</h3>
                        <p>Sign up in seconds to get started</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>Set Interests</h3>
                        <p>Tell us what topics interest you</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Get Personalized News</h3>
                        <p>Enjoy news tailored just for you</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
