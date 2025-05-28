from typing import List, Optional
from typing_extensions import Literal
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session

from app.dependencies import get_session, oauth2_scheme
from app.routers.user import get_current_user
from app.schemas.publication import PublicationCreate, PublicationRead, PublicationStateUpdate, PublicationUpdate
from app.crud.publication import delete_publication_by_id, get_publications, get_publication_by_id, create_publication, edit_publication_by_id, update_publication_state
from app.utils.authentication import decode_access_token

from app.crud.user import get_user_by_email

router = APIRouter(prefix="/publications", tags=["publications"])


@router.get("/", response_model=List[PublicationRead])
def read_publications(
    tab: Literal["need", "help"] = Query(..., description="need=requests, help=offers"),
    university: Optional[str] = Query(None),
    faculty: Optional[str] = Query(None),
    subject: Optional[str] = Query(None),
    db: Session = Depends(get_session),
):
    is_offer = tab == "help"
    return get_publications(db, is_offer, university, faculty, subject)


@router.get("/{publication_id}", response_model=PublicationRead, status_code=status.HTTP_200_OK)
def read_publication_by_id_endpoint(publication_id: int, db: Session = Depends(get_session)):
    publication = get_publication_by_id(db, publication_id)
    if not publication:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Publication not found",
        )
    return publication



@router.post("/", response_model=PublicationRead, status_code=status.HTTP_201_CREATED)
def create_publication_endpoint(
    pub_in: PublicationCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_session)
):
    email = decode_access_token(token)
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return create_publication(db, pub_in, author_id=user.id)


@router.delete("/{publication_id}/", status_code=status.HTTP_204_NO_CONTENT)
def delete_publication_by_id_endpoint(
    publication_id: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_session),
):
    publication = get_publication_by_id(db, publication_id)
    if not publication:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")

    if publication.author_id != get_current_user(token, db).id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions to delete")

    delete_publication_by_id(db, publication)


@router.put("/{publication_id}", response_model=PublicationRead, status_code=status.HTTP_200_OK)
def update_publication_endpoint(
    publication_id: int,
    pub_in: PublicationUpdate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_session),
):
    email = decode_access_token(token)

    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    existing = get_publication_by_id(db, publication_id)
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")
    if existing.author_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions to edit")
    updated = edit_publication_by_id(db, publication_id, pub_in)
    return updated


@router.patch("/{publication_id}", response_model=PublicationRead, status_code=status.HTTP_200_OK)
def patch_publication_state(
    publication_id: int,
    state: PublicationStateUpdate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_session),
):
    email = decode_access_token(token)
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    pub = get_publication_by_id(db, publication_id)
    if not pub:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")
    if pub.author_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions to update state")

    updated = update_publication_state(db, publication_id, state.is_active)
    return updated
