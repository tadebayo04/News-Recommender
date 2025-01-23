import React, { useEffect, useState } from 'react';

function HomePage() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Retrieve interests from localStorage
        const interests = localStorage.getItem('userInterests') || '';

        if (!interests) {
            setError('No interests provided.');
            setLoading(false);
            return;
        }

        const fetchNews = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/news?query=${interests}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch news');
                }
                const data = await response.json();
                setNews(data);
            } catch (error) {
                setError('Error fetching news. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) {
        return <div>Loading news...</div>;
    }

    return (
        <div className="news-container">
            <h1>Your Personalized News</h1>
            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                news.length > 0 ? (
                    news.map((article, index) => (
                        <div key={index} className="news-article">
                            <h2>{article.title}</h2>
                            <p>{article.description}</p>
                            <img src={article.image} alt={article.title} />
                            <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                        </div>
                    ))
                ) : (
                    <p>No news available for your interests.</p>
                )
            )}
        </div>
    );
}

export default HomePage;
