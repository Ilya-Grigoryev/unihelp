from datetime import datetime
from typing import List
from pydantic import BaseModel, computed_field

from app.schemas.user_public import UserPublic
from app.schemas.publication import PublicationRead

class UserProfile(UserPublic):
    created_at: datetime
    publications: List[PublicationRead] = []

    @computed_field
    @property
    def active_offers(self) -> int:
        return sum(1 for p in self.publications if p.is_offer)

    @computed_field
    @property
    def active_requests(self) -> int:
        return sum(1 for p in self.publications if not p.is_offer)

    @computed_field
    @property
    def helped(self) -> int:
        return 5

    @computed_field
    @property
    def got_help(self) -> int:
        return 4

    @computed_field
    @property
    def rating(self) -> float:
        return 4.8

    class Config:
        from_attributes = True



class ProfileUpdate(BaseModel):
    name: str
    university: str
    bio: str



class AvatarResponse(BaseModel):
    avatar: str