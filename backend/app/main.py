from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import SQLModel

from app.dependencies import engine
from app.routers.auth import router as auth_router
from app.routers.user import router as user_router
from app.routers.helloworld import router as hello_router
from app.routers.publication import router as publications_router
from app.routers.profile import router as profile_router


app = FastAPI(title="UNI:HELP API")

from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
app.mount(
  "/static",
  StaticFiles(directory=BASE_DIR / "static"),
  name="static",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],      # OPTIONS, GET, POST, etc.
    allow_headers=["*"],      # allow all headers (Authorization, Content-Type…)
)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

app.include_router(hello_router)
app.include_router(auth_router)
app.include_router(publications_router)
app.include_router(user_router)
app.include_router(profile_router)
