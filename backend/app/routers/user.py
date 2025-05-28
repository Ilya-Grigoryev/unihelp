# app/routers/users.py

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.crud.publication import get_publications_by_author
from app.dependencies import get_session, oauth2_scheme
from app.crud.user import get_user_by_email, get_my_publications, get_user_by_id

from app.schemas.publication import PublicationRead
from app.schemas.user_public import UserPublic
from app.utils.authentication import decode_access_token

router = APIRouter(prefix="/users", tags=["users"])


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_session),
):
    email = decode_access_token(token)
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user

@router.get("/me", response_model=UserPublic)
def read_users_me(current_user = Depends(get_current_user)):
    return current_user


@router.get("/me/publications", response_model=List[PublicationRead])
def read_own_publications(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    publications = get_publications_by_author(db, current_user.id)
    return publications


@router.get("/me/publications", response_model=List[PublicationRead])
def read_own_publications(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    publications = get_my_publications(db, current_user.id)
    return publications
