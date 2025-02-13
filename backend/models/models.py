from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database import Base
from datetime import datetime
from passlib.context import CryptContext

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    interests = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Password hashing context
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def set_password(self, password):
        self.hashed_password = self.pwd_context.hash(password)

    def verify_password(self, password):
        return self.pwd_context.verify(password, self.hashed_password)

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    category = Column(String)  # Assuming category is a string 

class ArticleInteraction(Base):
    __tablename__ = "article_interactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    article_title = Column(String)
    article_url = Column(String)
    clicked_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="interactions")

User.interactions = relationship("ArticleInteraction", back_populates="user") 