# Constants to be used throughout the restAPI

# Libraries
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from pydantic import StringConstraints, EmailStr
from enum import Enum
from pydantic.functional_validators import AfterValidator
# Files
from .helpers.validation_helper import validatePassword

class ValidFields(Enum):
    NAME = Annotated[str, StringConstraints(pattern=r'^[a-zA-Z]{3,20}$')]
    PASS = Annotated[str, AfterValidator(validatePassword)]
    EMAIL = EmailStr

class TOKEN_VARS(Enum):
    SECRET_KEY = '6d1ac7c0949dbbec8f60c4d8be82473b66c882c57486422039b049c560d8e4a3'
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    OAUTH2_SCHEME = OAuth2PasswordBearer(tokenUrl='rest/login/token')

PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")

