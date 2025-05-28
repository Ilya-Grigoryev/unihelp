from datetime import datetime
from pydantic import BaseModel
from typing import Optional

from app.schemas.user_public import UserPublic


class PublicationCreate(BaseModel):
    is_offer: bool
    title: str
    university: str
    faculty: str
    subject: str
    price: float = 0
    description: str


class PublicationRead(BaseModel):
    id: int
    is_offer: bool
    title: str
    university: str
    faculty: str
    subject: str
    price: float
    description: str
    bought: int
    is_active: bool
    created_at: datetime
    author: UserPublic

    class Config:
        from_attributes = True


class PublicationUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None


class PublicationStateUpdate(BaseModel):
    is_active: bool
