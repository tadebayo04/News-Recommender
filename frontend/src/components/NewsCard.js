import React from 'react';

const NewsCard = ({ article }) => {
    return (
        <div className="news-card">
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
                <img 
                    src={article.image} 
                    alt={article.title} 
                    style={{
                        width: "250px",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px"
                    }} 
                />
            </a>
        </div>
    );
};

export default NewsCard;