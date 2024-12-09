# Will ensure frontend requests fit within these models and the fields are valid.
# They will also be used to store data retreived from the database. Might create separate classes for this but I find this more convenient.

# Libraries
from pydantic import BaseModel
from datetime import datetime
# Files
from .constants import ValidFields

class User(BaseModel):
    UserID: int|None = None
    fName: ValidFields.NAME.value
    lName: ValidFields.NAME.value
    email: ValidFields.EMAIL.value
    dateRegistered: datetime|None=None
    isDisabled: bool | None = None

class UserRegister(BaseModel):
    fName: ValidFields.NAME.value
    lName: ValidFields.NAME.value
    email: ValidFields.EMAIL.value
    password: ValidFields.PASS.value
    
    model_config = {"extra": "forbid"}


class UserInDB(User):
    hashedPassword: str
    

class UserLogin(BaseModel):
    email: ValidFields.EMAIL.value
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: ValidFields.EMAIL.value | None = None
