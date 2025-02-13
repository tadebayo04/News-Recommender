import os
import requests
from fastapi import FastAPI, Depends, HTTPException, Body, Query
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from backend import crud
from backend.models.models import User, Article, ArticleInteraction
from backend.database import SessionLocal, engine, get_db
from backend.database import Base
from datetime import datetime, timedelta
from fastapi.responses import JSONResponse
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pydantic import BaseModel

# ✅ Create FastAPI app
app = FastAPI()

# ✅ Add CORS middleware (Only once)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create database tables
# Base.metadata.drop_all(bind=engine)  # Remove or comment this line
Base.metadata.create_all(bind=engine)

# ✅ TheNewsAPI Configuration (Consider replacing NewsAPI.org)
THENEWS_API_KEY = "GF46ddisFlq34CKf2LLhIhTCPTUA9RIazT42lEbV"
THENEWS_API_URL = "https://api.thenewsapi.com/v1/news/all"

@app.get("/api/news")
def fetch_news(query: str = Query("technology", min_length=3, description="Search news by topic")):
    """Fetch news from TheNewsAPI based on user interests, with formatted dates."""
    # Get current UTC time and format dates
    now = datetime.utcnow()
    today = now.strftime("%Y-%m-%d")
    yesterday = (now - timedelta(days=1)).strftime("%Y-%m-%d")

    params = {
        "api_token": THENEWS_API_KEY,
        "search": query,
        "language": "en",
        "limit": 20,  # Increased limit to get more articles
        "sort": "published_at",
        "published_after": yesterday,  # From yesterday
        "published_before": (now + timedelta(days=1)).strftime("%Y-%m-%d"),  # Until tomorrow to handle timezone differences
    }

    try:
        response = requests.get(THENEWS_API_URL, params=params)
        response.raise_for_status()

        news_data = response.json().get("data", [])
        
        # Print for debugging
        print(f"Found {len(news_data)} articles from API")
        if news_data:
            print(f"Most recent article date: {news_data[0]['published_at']}")
            print(f"Oldest article date: {news_data[-1]['published_at']}")

        formatted_news = [
            {
                "title": article["title"],
                "description": article["description"],
                "image": article.get("image_url", "https://via.placeholder.com/150"),
                "url": article["url"],
                "publishedAt": datetime.strptime(article["published_at"], "%Y-%m-%dT%H:%M:%S.%fZ").strftime("%B %d, %Y %I:%M %p")
            }
            for article in news_data
        ]

        # Sort by date, most recent first
        formatted_news.sort(key=lambda x: datetime.strptime(x["publishedAt"], "%B %d, %Y %I:%M %p"), reverse=True)

        return JSONResponse(
            content=formatted_news, 
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        )

    except requests.exceptions.RequestException as e:
        print(f"Error fetching news: {e}")
        raise HTTPException(status_code=500, detail="Unable to fetch news from external API")


# ✅ User Authentication (Register & Login)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.post("/register")
async def register_user(user_data: dict, db: Session = Depends(get_db)):
    """Register a new user"""
    db_user = crud.get_user_by_email(db, email=user_data["email"])
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user and return without password
    user = crud.create_user(db=db, user_data=user_data)
    return {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name
    }

@app.post("/login")
async def login(data: dict = Body(...), db: Session = Depends(get_db)):
    """User Login"""
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")
    
    user = crud.authenticate_user(db, email, password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    # Return user data without sensitive information
    return {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "message": "Login successful"
    }

# ✅ Save User Interests
@app.post("/interests")
async def save_interests(interests: dict, db: Session = Depends(get_db)):
    """Save user interests in the database."""
    user_id = interests.get("user_id")
    user_interests = interests.get("interests", [])

    if not user_id or not user_interests:
        raise HTTPException(status_code=400, detail="User ID and interests are required")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Clean and format interests
    cleaned_interests = [interest.strip().lower() for interest in user_interests]
    user.interests = ",".join(cleaned_interests)
    db.commit()

    print(f"Saved interests for user {user_id}: {user.interests}")  # Debug print
    return {"message": "Interests saved successfully"}

# ✅ Get Personalized News Based on Interests
@app.post("/personalized-news")
async def get_personalized_news(data: dict, db: Session = Depends(get_db)):
    """Fetch personalized news based on user interests."""
    user_id = data.get("user_id")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.interests:
        raise HTTPException(status_code=404, detail="User interests not found")

    # ✅ Convert interests string into a list
    user_interests = user.interests.split(",")
    query_string = " OR ".join(user_interests)

    return fetch_news(query=query_string)  # ✅ Reuse `fetch_news()` for personalized results

# Add this class near the top of the file with other imports
class ArticleClick(BaseModel):
    user_id: int
    article_title: str
    article_url: str

# Update the track-click endpoint
@app.post("/api/track-click")
def track_article_click(click_data: ArticleClick, db: Session = Depends(get_db)):
    """Track when a user clicks on an article."""
    
    # Check if the user exists
    user = db.query(User).filter(User.id == click_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Create and save the interaction
    interaction = ArticleInteraction(
        user_id=click_data.user_id,
        article_title=click_data.article_title,
        article_url=click_data.article_url
    )
    db.add(interaction)
    db.commit()
    db.refresh(interaction)

    return {"message": "Article click recorded", "interaction_id": interaction.id}

@app.get("/api/recommended-news")
def recommend_news(user_id: int, db: Session = Depends(get_db)):
    """Recommend articles based on user's interests and past clicks."""
    
    # Get user and their interests
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get user's interests
    user_interests = user.interests.split(",") if user.interests else []
    print(f"User interests: {user_interests}")

    # Fetch user interactions
    user_interactions = db.query(ArticleInteraction).filter(ArticleInteraction.user_id == user_id).all()
    
    # Extract keywords from clicked articles
    keywords = set()
    for interaction in user_interactions:
        # Split title into words and filter out common words
        words = interaction.article_title.lower().split()
        filtered_words = [
            word for word in words 
            if len(word) > 3  # Skip short words
            and word not in {'the', 'and', 'for', 'that', 'with', 'from'}  # Skip common words
        ]
        keywords.update(filtered_words)
    
    print(f"Extracted keywords: {keywords}")

    # Combine interests and keywords for search
    search_terms = list(keywords)
    if user_interests:
        search_terms.extend(user_interests)

    # Use the most relevant keywords (limit to avoid too long queries)
    search_terms = search_terms[:5]  # Limit to top 5 terms
    search_query = " OR ".join(search_terms) if search_terms else "general"
    print(f"Search query: {search_query}")

    try:
        # Fetch articles based on keywords
        response = requests.get(
            "http://127.0.0.1:8000/api/news",
            params={"query": search_query}
        )
        response.raise_for_status()
        articles = response.json()
        print(f"Found {len(articles)} articles")

        if not articles:
            return {"message": "No articles found"}

        # If we have clicked articles, use them for ranking
        if user_interactions:
            articles_texts = [f"{a['title']} {a.get('description', '')}" for a in articles]
            clicked_texts = [" ".join(keywords)]  # Use keywords instead of full titles

            vectorizer = TfidfVectorizer(stop_words="english")
            tfidf_matrix = vectorizer.fit_transform(clicked_texts + articles_texts)
            similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]

            # Rank and return articles
            ranked_articles = sorted(zip(articles, similarity_scores), key=lambda x: x[1], reverse=True)
            return [{
                "title": article["title"],
                "description": article["description"],
                "url": article["url"],
                "image": article["image"],
                "publishedAt": article["publishedAt"],
                "score": float(score)
            } for article, score in ranked_articles[:5]]
        
        # If no clicks, return interest-based articles
        return articles[:5]

    except requests.exceptions.RequestException as e:
        print(f"Error fetching articles: {e}")
        raise HTTPException(status_code=500, detail="Error fetching articles from the news API")
