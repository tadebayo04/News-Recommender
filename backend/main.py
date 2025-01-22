import os
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Key (Replace with your actual NewsAPI key)
NEWS_API_KEY = "db972e6bed9445579c2262b952516087"
NEWS_API_URL = "https://newsapi.org/v2/top-headlines"

@app.get("/api/news")
def fetch_news():
    params = {
        "apiKey": NEWS_API_KEY,
        "country": "us",  # Fetch news from the US; change based on preference
        "category": "technology",  # Change category (business, sports, health, etc.)
        "pageSize": 10  # Number of articles to fetch
    }
    
    response = requests.get(NEWS_API_URL, params=params)

    if response.status_code == 200:
        news_data = response.json().get("articles", [])
        formatted_news = [
            {
                "title": article["title"],
                "description": article["description"],
                "image": article["urlToImage"] or "https://via.placeholder.com/150",
                "url": article["url"]
            }
            for article in news_data if article["title"] and article["urlToImage"]
        ]
        return formatted_news

    return {"error": "Unable to fetch news"}
