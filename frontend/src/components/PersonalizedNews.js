import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewsCard from './NewsCard'; // Ensure you have a NewsCard component
import './NewsFeed.css'; // Optional styling

const PersonalizedNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRecommendedNews = async () => {
        setLoading(true);
        setError(null);

        try {
            const userId = localStorage.getItem("userId"); // Fetch user ID from storage
            if (!userId) {
                setError("User not logged in.");
                setLoading(false);
                return;
            }

            const response = await axios.get(`http://127.0.0.1:8000/api/recommended-news?user_id=${userId}`);

            if (response.status === 200) {
                setNews(response.data);
            } else {
                throw new Error("Failed to fetch recommendations.");
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            setError(<><span role="img" aria-label="warning">⚠️</span> Failed to load recommendations.</>);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendedNews();
    }, []);

    return (
        <div className="news-feed">
            <h1><span role="img" aria-label="pushpin">📌</span> Personalized News Recommendations</h1>
            <button onClick={fetchRecommendedNews} className="refresh-button">
                <span role="img" aria-label="refresh">🔄</span> Refresh Recommendations
            </button>

            {loading ? (
                <p><span role="img" aria-label="hourglass">⌛</span> Loading recommendations...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                news.length > 0 ? (
                    <div className="news-card-container">
                        {news.map((article, index) => (
                            <NewsCard key={index} article={article} />
                        ))}
                    </div>
                ) : (
                    <p><span role="img" aria-label="empty mailbox">📭</span> No recommendations available yet.</p>
                )
            )}
        </div>
    );
};

export default PersonalizedNews;
