import React from 'react';
import './NewsCard.css';
import axios from 'axios';

const NewsCard = ({ article }) => {
  // Convert date format for better readability
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleString('en-US', {
      weekday: 'short', // "Mon"
      year: 'numeric', // "2025"
      month: 'short', // "Feb"
      day: 'numeric', // "12"
      hour: '2-digit', // "02"
      minute: '2-digit', // "30"
      hour12: true // 12-hour format with AM/PM
    });
  };

  const handleArticleClick = async (article) => {
    // Validate article object
    if (!article || !article.title || !article.url) {
        console.error("Invalid article data");
        return;
    }

    // Retrieve user ID from local storage
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("User ID not found in local storage");
        return;
    }

    try {
        const response = await axios.post("http://127.0.0.1:8000/api/track-click", {
            user_id: parseInt(userId), // Convert to number
            article_title: article.title,
            article_url: article.url
        });
        console.log("Click tracked successfully:", response.data);
    } catch (error) {
        console.error("Error tracking click:", error);
    }
  };

  return (
    <div className="news-card">
      <img src={article.image || "https://via.placeholder.com/150"} alt={article.title} />
      <h3>{article.title}</h3>
      <p>{article.description}</p>
      <p className="news-date"> {formatDate(article.publishedAt)}</p>
      <a 
        href={article.url} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={() => handleArticleClick(article)}
      >
        Read more
      </a>
    </div>
  );
};

export default NewsCard;
