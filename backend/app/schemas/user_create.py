from pydantic import BaseModel, EmailStr, model_validator

class UserCreate(BaseModel):
    name: str
    university: str
    email: EmailStr
    password: str
    repeat_password: str

    @model_validator(mode="after")
    def passwords_match(self):
        if self.password != self.repeat_password:
            raise ValueError("Passwords do not match")
        return self