import React, { useState } from 'react';
import axios from 'axios';
import './Interests.css';

const Interests = () => {
    const [interests, setInterests] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [error, setError] = useState('');

    const suggestions = [
        'Technology', 'Sports', 'Politics', 'Entertainment',
        'Science', 'Health', 'Business', 'Travel',
        'Food', 'Fashion', 'Music', 'Movies'
    ];

    const handleInputChange = (e) => {
        setCurrentInput(e.target.value);
    };

    const handleInputKeyPress = (e) => {
        if (e.key === 'Enter' && currentInput.trim()) {
            addInterest(currentInput.trim());
        }
    };

    const addInterest = (interest) => {
        if (!interests.includes(interest)) {
            setInterests([...interests, interest]);
            setCurrentInput('');
            setError('');
        }
    };

    const removeInterest = (interestToRemove) => {
        setInterests(interests.filter(interest => interest !== interestToRemove));
    };

    const handleSubmit = async () => {
        if (interests.length === 0) {
            setError('Please add at least one interest');
            return;
        }

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('Please log in first');
                return;
            }

            await axios.post('http://127.0.0.1:8000/interests', {
                user_id: userId,
                interests: interests
            });

            // Store interests locally for immediate use
            localStorage.setItem('userInterests', interests.join(','));
            alert('Interests saved successfully!');
        } catch (error) {
            setError('Failed to save interests. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="interests-container">
            <div className="interests-header">
                <h1>Your Interests</h1>
                <p>Tell us what you're interested in to get personalized news recommendations</p>
            </div>

            <div className="interests-form">
                <div className="input-group">
                    <label>Add Interest</label>
                    <input
                        type="text"
                        value={currentInput}
                        onChange={handleInputChange}
                        onKeyPress={handleInputKeyPress}
                        placeholder="Type an interest and press Enter"
                    />
                </div>

                <div className="interests-chips">
                    {interests.map((interest, index) => (
                        <div key={index} className="interest-chip">
                            {interest}
                            <button onClick={() => removeInterest(interest)}>×</button>
                        </div>
                    ))}
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="suggestions">
                    <h3>Suggested Interests</h3>
                    <div className="suggestion-chips">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="suggestion-chip"
                                onClick={() => addInterest(suggestion)}
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={interests.length === 0}
                >
                    Save Interests
                </button>
            </div>
        </div>
    );
};

export default Interests;
