import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewsCard from './NewsCard';
import './NewsFeed.css'; // Ensure you have the CSS for styling

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const userInterests = localStorage.getItem('userInterests') || 'general';
      const response = await axios.get(`http://127.0.0.1:8000/api/news?query=${userInterests}`);
      const sortedNews = response.data.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      setNews(sortedNews);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Failed to load news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="news-feed">
      <button onClick={fetchNews} className="refresh-button">Refresh News</button>
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
