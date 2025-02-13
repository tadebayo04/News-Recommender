import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewsCard from './NewsCard';
import './NewsFeed.css'; 

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
        const userInterests = localStorage.getItem('userInterests') || 'general';
        
        const response = await axios.get(`http://127.0.0.1:8000/api/news`, {
            params: {
                query: userInterests,
                limit: 10,
                page: 1
            },
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
        
        if (response.status === 200 && response.data.length > 0) {
            setNews(response.data); // Data is already sorted by backend
            setLastUpdated(new Date());
        } else {
            console.error("No news articles found or unexpected response structure:", response.data);
            setError("No news articles found.");
        }
    } catch (error) {
        console.error("Error fetching news:", error);
        setError("Failed to load news.");
    } finally {
        setLoading(false);
    }
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="news-feed">
      <div className="news-header">
        <button onClick={fetchNews} className="refresh-button">
          Refresh News
        </button>
        <span className="last-updated">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </span>
      </div>
      
      {loading ? (
        <p>Loading news...</p>
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
          <p>No news available.</p>
        )
      )}
    </div>
  );
};

export default NewsFeed;
