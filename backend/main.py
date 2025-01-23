import os
import requests
from fastapi import FastAPI, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext

from backend import crud
from backend.models.models import User, Article
from backend.database import SessionLocal, engine, get_db
from backend.database import Base

# Create FastAPI app 
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# API Key (Replace with your actual NewsAPI key)
NEWS_API_KEY = "db972e6bed9445579c2262b952516087"
NEWS_API_URL = "https://newsapi.org/v2/top-headlines"

from fastapi import FastAPI, Query
import requests
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# NewsAPI Configuration
NEWS_API_KEY = "db972e6bed9445579c2262b952516087"
NEWS_API_URL = "https://newsapi.org/v2/everything"

@app.get("/api/news")
def fetch_news(query: str = Query(..., min_length=3, description="Search news by topic")):
    """Fetch personalized news based on user interest."""
    params = {
        "apiKey": NEWS_API_KEY,
        "q": query,  # User inputted search query
        "language": "en",
        "sortBy": "relevancy",
        "pageSize": 10
    }

    response = requests.get(NEWS_API_URL, params=params)

    if response.status_code == 200:
        news_data = response.json().get("articles", [])
        formatted_news = [
            {
                "title": article["title"],
                "description": article["description"],
                "image": article.get("urlToImage", "https://via.placeholder.com/150"),
                "url": article["url"]
            }
            for article in news_data if article["title"] and article.get("urlToImage")
        ]
        return formatted_news

    return {"error": "Unable to fetch news"}


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.post("/register")
async def register_user(user_data: dict, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user_data["email"])
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user_data=user_data)

@app.post("/login")
async def login(
    data: dict = Body(...),  # Change this to accept JSON body
    db: Session = Depends(get_db)
):
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")
    
    user = crud.authenticate_user(db, email, password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
    return {"message": "Login successful"}

@app.post("/interests")
async def save_interests(interests: dict, db: Session = Depends(get_db)):
    # Here you would save the interests to the database
    # For example, you could associate them with the logged-in user
    return {"message": "Interests saved successfully"}

@app.post("/personalized-news")
async def get_personalized_news(interests: dict, db: Session = Depends(get_db)):
    user_interests = interests.get("interests", [])
    articles = db.query(Article).filter(Article.category.in_(user_interests)).all()
    return articles