# Constants to be used throughout the restAPI

# Libraries
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from pydantic import StringConstraints, EmailStr
from enum import Enum
from pydantic.functional_validators import AfterValidator
from fastapi import HTTPException, status
# Files
from .helpers.validation_helper import validatePassword

class ValidFields(Enum):
    NAME = Annotated[str, StringConstraints(pattern=r'^[a-zA-Z]{3,20}$')]
    PASS = Annotated[str, AfterValidator(validatePassword)]
    EMAIL = EmailStr

class TOKEN_VARS(Enum):
    SECRET_KEY = '6d1ac7c0949dbbec8f60c4d8be82473b66c882c57486422039b049c560d8e4a3' # Ummmm ignore this minor mistake.. I'm a promising developer i swear :)
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 300
    OAUTH2_SCHEME = OAuth2PasswordBearer(tokenUrl='rest/login/token')

PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")

class HTTP_EXCEPTIONS(Enum):
    TOKEN = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    INACTIVE_USER = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST, 
        detail="Inactive user"
    )
    INVALID_CREDENTIALS = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )
    DATABASE = HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail='Database Error'
    )
    USER_EXISTS = HTTPException(
        status_code=status.HTTP_226_IM_USED,
        detail='User Exists'
    )
    EMAIL_USED = HTTPException(
        status_code=status.HTTP_226_IM_USED,
        detail='Email Used'
    )