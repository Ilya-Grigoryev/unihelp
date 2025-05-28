from fastapi import APIRouter


router = APIRouter(prefix="", tags=["hello"])

@router.get("/")
def hello_world():
    return {"message": "UNI:HELP API is running!"}
