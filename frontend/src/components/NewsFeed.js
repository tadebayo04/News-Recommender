import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewsCard from './NewsCard';

const NewsFeed = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/news")
      .then(response => {
        setNews(response.data);
      })
      .catch(error => {
        console.error("Error fetching news:", error);
      });
  }, []);

  return (
    <div className="news-feed">
      {news.length > 0 ? (
        news.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))
      ) : (
        <p>Loading news...</p>
      )}
    </div>
  );
};

export default NewsFeed;
