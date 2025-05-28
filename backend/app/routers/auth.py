# app/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from app.dependencies import get_session  # сессия БД + OAuth2 схема лежит тут
from app.crud.user import get_user_by_email, create_user
from app.schemas.user_create import UserCreate
from app.schemas.user_public import UserPublic
from app.schemas.token import Token
from app.utils.authentication import (
    verify_password,
    create_access_token,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=UserPublic,
    status_code=status.HTTP_201_CREATED,
)
def register(
    user_in: UserCreate,
    db: Session = Depends(get_session),
):
    # Проверяем, что email уникален
    if get_user_by_email(db, user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    # Создаём пользователя (хеширование внутри create_user)
    user = create_user(db, user_in)
    return user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_session),
):
    # Находим юзера по email
    user = get_user_by_email(db, form_data.username)
    # Проверяем пароль
    if not user:
        print("User not found")
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Генерируем JWT и возвращаем
    access_token = create_access_token(user.email)
    return {"access_token": access_token, "token_type": "bearer"}
