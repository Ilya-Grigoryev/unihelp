# app/dependencies.py

from typing import Generator
from datetime import timedelta

from fastapi.security import OAuth2PasswordBearer
from sqlmodel import create_engine, Session

# ——————————————
# База данных
# ——————————————
DATABASE_URL = "sqlite:///./database.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

def get_session() -> Generator[Session, None, None]:
    """FastAPI dependency для работы с сессией SQLModel/SQLAlchemy."""
    with Session(engine) as session:
        yield session


# ——————————————
# Настройки безопасности
# ——————————————
SECRET_KEY = "your-very-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2 схема для Depends в роутерах
# при логине у нас tokenUrl="/users/login"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

