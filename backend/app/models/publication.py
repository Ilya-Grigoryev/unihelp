from typing import TYPE_CHECKING, Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from app.models.user import UserTable


if TYPE_CHECKING:
    from app.models.user import UserTable


class Publication(SQLModel, table=True):
    __tablename__ = "publication"

    id: Optional[int] = Field(default=None, primary_key=True)
    is_offer: bool = Field(nullable=False, description="Это предложение (offer) или запрос (request)")
    title: str = Field(nullable=False)
    university: str = Field(nullable=False)
    faculty: str = Field(nullable=False)
    subject: str = Field(nullable=False)
    price: float = Field(default=0, description="Цена")
    description: str = Field(nullable=False)
    bought: int = Field(default=0, description="Сколько раз куплено")
    is_active: bool = Field(default=True, description="Активна ли публикация")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    author_id: int = Field(foreign_key="usertable.id", nullable=False)

    author: Optional["UserTable"] = Relationship(back_populates="publications")
