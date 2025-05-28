from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlmodel import SQLModel, Field

from typing import List
from sqlmodel import Relationship


if TYPE_CHECKING:
    from app.models.publication import Publication


class UserTable(SQLModel, table=True):
    __tablename__ = "usertable"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(nullable=False)
    university: str = Field(nullable=False)
    email: str = Field(index=True, unique=True, nullable=False)
    hashed_password: str
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    publications: List["Publication"] = Relationship(back_populates="author")
    avatar: Optional[str] = Field(default=None, nullable=True, description="URL аватара пользователя")
    bio: Optional[str] = Field(default=None, nullable=True, description="Краткая биография пользователя")
