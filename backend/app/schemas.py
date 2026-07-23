# request/response shapes
from pydantic import BaseModel, EmailStr

from datetime import datetime
from typing import Optional



class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class IncidentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    severity: str = "low"

class IncidentUpdate(BaseModel):
    status: Optional[str] = None
    severity: Optional[str] = None

class IncidentOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    severity: str
    created_at: datetime

    class Config:
        from_attributes = True    