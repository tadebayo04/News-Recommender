from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr  # Use EmailStr for better validation
    first_name: str
    last_name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    username: str

    class Config:
        from_attributes = True  # Updated for Pydantic v2 compatibility
