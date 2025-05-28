from typing import List, Optional
from sqlmodel import Session, select
from app.models.publication import Publication
from app.schemas.publication import PublicationCreate, PublicationUpdate


def get_publications(
    db: Session,
    is_offer: bool,
    university: Optional[str] = None,
    faculty: Optional[str] = None,
    subject: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
) -> List[Publication]:
    stmt = select(Publication).where(Publication.is_offer == is_offer).where(Publication.is_active == True)

    if university:
        stmt = stmt.where(Publication.university == university)
    if faculty:
        stmt = stmt.where(Publication.faculty == faculty)
    if subject:
        stmt = stmt.where(Publication.subject == subject)

    stmt = stmt.offset(skip).limit(limit)
    return db.exec(stmt).all()


def create_publication(db: Session, pub_in: PublicationCreate, author_id: int) -> Publication:
    pub = Publication(**pub_in.dict(), author_id=author_id)
    db.add(pub)
    db.commit()
    db.refresh(pub)
    return pub


def get_publication_by_id(db: Session, publication_id: int) -> Optional[Publication]:
    return db.get(Publication, publication_id)


def get_publications_by_author(db: Session, author_id: int) -> List[Publication]:
    stmt = select(Publication).where(Publication.author_id == author_id).where(Publication.is_active == True)
    publications = db.exec(stmt).all()
    return publications


def delete_publication_by_id(db: Session, publication: Publication) -> None:
    db.delete(publication)
    db.commit()


def edit_publication_by_id(db: Session, publication_id: int, pub_in: PublicationUpdate) -> Optional[Publication]:
    pub = get_publication_by_id(db, publication_id)
    if not pub:
        return None
    update_data = pub_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(pub, field, value)
    db.add(pub)
    db.commit()
    db.refresh(pub)
    return pub


def update_publication_state(db: Session, publication_id: int, is_active: bool) -> Optional[Publication]:
    pub = get_publication_by_id(db, publication_id)
    if not pub:
        return None
    pub.is_active = is_active
    db.add(pub)
    db.commit()
    db.refresh(pub)
    return pub
