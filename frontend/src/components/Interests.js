import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function InterestPage() {
    const [interests, setInterests] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (interests.trim() === '') {
            alert('Please enter at least one interest.');
            return;
        }

        // Store user interests in localStorage (for persistence)
        localStorage.setItem('userInterests', interests);

        // Redirect to /home with query parameters (optional)
        navigate('/home');
    };

    return (
        <div className="interest-container">
            <h1>Enter Your Interests</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter interests (e.g. Technology, Sports)"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                />
                <button type="submit">Find News</button>
            </form>
        </div>
    );
}

export default InterestPage;
