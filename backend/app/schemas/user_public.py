from pydantic import BaseModel, field_validator

class UserPublic(BaseModel):
    id: int
    name: str
    university: str
    bio:    str = ""
    avatar: str = ""

    @field_validator("bio", "avatar", mode="before")
    def _none_to_empty(cls, v):
        return v or ""

    class Config:
        from_attributes = True