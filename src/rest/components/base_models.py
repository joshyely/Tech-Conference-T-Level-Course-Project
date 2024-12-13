# Will ensure frontend requests fit within these models and the fields are valid.
# They will also be used to store data retreived from the database. Might create separate classes for this but I find this more convenient.

# Libraries
from pydantic import BaseModel
from datetime import datetime
# Files
from .constants import ValidFields

class User(BaseModel):
    userID: int|None = None
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
    userID: int | None = None


class PasswordPlusToken(BaseModel):
    token: Token
    password: str

class NewPassword(PasswordPlusToken):
    newPassword: ValidFields.PASS.value

class NewEmail(PasswordPlusToken):
    newEmail: ValidFields.EMAIL.value