import os
import requests
from fastapi import FastAPI, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext

from backend import crud
from backend.models.models import User
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