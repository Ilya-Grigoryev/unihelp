from typing import List, Optional
from sqlmodel import Session, select
from app.crud.publication import get_publications_by_author
from app.models.user import UserTable
from app.schemas.user_profile import ProfileUpdate


def get_profile_by_id(db: Session, user_id: int) -> Optional[UserTable]:
    user = db.get(UserTable, user_id)
    if not user:
        return None

    publications = get_publications_by_author(db, user_id)
    user.publications = publications  

    return user


def edit_profile_by_id(db: Session, user_id: int, user_in: ProfileUpdate) -> Optional[UserTable]:
    user = get_profile_by_id(db, user_id)
    if not user:
        return None

    update_data = user_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user_avatar(
    db: Session,
    user_id: int,
    avatar_url: str
) -> Optional[UserTable]:
    user = db.get(UserTable, user_id)
    if not user:
        return None

    user.avatar = avatar_url
    db.add(user)
    db.commit()
    db.refresh(user)
    return user