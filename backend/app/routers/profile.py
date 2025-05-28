import os
from uuid import uuid4
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlmodel import Session

from app.crud.profile import edit_profile_by_id, get_profile_by_id, update_user_avatar
from app.crud.user import get_user_by_email
from app.dependencies import get_session, oauth2_scheme
from app.models.user import UserTable
from app.routers.user import get_current_user
from app.schemas.user_profile import AvatarResponse, ProfileUpdate, UserProfile
from app.utils.authentication import decode_access_token

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/{user_id}", response_model=UserProfile, status_code=status.HTTP_200_OK)
def read_user_profile(
    user_id: int,
    db: Session = Depends(get_session),
):
    user = get_profile_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user



@router.put("/{user_id}", status_code=status.HTTP_200_OK)
def update_publication_endpoint(
    user_id: int,
    prof_in: ProfileUpdate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_session),
):
    email = decode_access_token(token)

    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    existing = get_profile_by_id(db, user_id)
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")
    if existing.id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions to edit")
    updated = edit_profile_by_id(db, user_id, prof_in)
    return updated


MAX_AVATAR_SIZE = 2 * 1024 * 1024

@router.patch(
    "/avatar",
    response_model=AvatarResponse,
)
def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_session),
    current_user: UserTable = Depends(get_current_user),
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Need to send an image"
        )
    
    contents = file.file.read()
    if len(contents) > MAX_AVATAR_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image too large, max size is {MAX_AVATAR_SIZE // (1024*1024)} MB",
        )

    if current_user.avatar:
        old_filename = os.path.basename(current_user.avatar)
        old_path = os.path.join("static", "avatars", old_filename)
        if os.path.isfile(old_path):
            try:
                os.remove(old_path)
            except OSError:
                pass

    ext = os.path.splitext(file.filename)[1]
    filename = f"{current_user.id}_{uuid4().hex}{ext}"
    save_dir = os.path.join("static", "avatars")
    os.makedirs(save_dir, exist_ok=True)
    file_path = os.path.join(save_dir, filename)

    with open(file_path, "wb") as out:
        out.write(contents)

    avatar_url = f"/static/avatars/{filename}"
    
    updated = update_user_avatar(db, current_user.id, avatar_url)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update avatar in database",
        )

    return AvatarResponse(avatar=avatar_url)