from typing import List
from sqlmodel import Session, select
from app.models.publication import Publication
from app.models.user import UserTable
from app.schemas.user_create import UserCreate

from app.utils.authentication import get_password_hash


def get_user_by_id(db: Session, id: int) -> UserTable | None:
    stmt = select(UserTable).where(UserTable.id == id)
    return db.exec(stmt).first()


def get_user_by_email(db: Session, email: str) -> UserTable | None:
    stmt = select(UserTable).where(UserTable.email == email)
    return db.exec(stmt).first()


def create_user(db: Session, user_in: UserCreate) -> UserTable:
    hashed = get_password_hash(user_in.password)
    user = UserTable(
        name=user_in.name,
        university=user_in.university,
        email=user_in.email, 
        hashed_password=hashed
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_my_publications(db: Session, author_id: int) -> List[Publication]:
    stmt = select(Publication).where(Publication.author_id == author_id)
    publications = db.exec(stmt).all()
    return publications
