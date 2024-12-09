# Contains helper functions that authenticate a user. Used by login.py and auth.py

# Libraries
from typing import Annotated
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi import HTTPException, status, Depends
from datetime import datetime, timedelta, timezone
# Files
from ..base_models import User, TokenData, Token
from ..constants import TOKEN_VARS, PWD_CONTEXT
from . import get_helper


async def getUserFromToken(token: Annotated[str, Depends(TOKEN_VARS.OAUTH2_SCHEME.value)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token = str(token).replace("token_type='bearer'", "").replace("access_token=", "").replace("'", "").strip()
    try:
        payload = jwt.decode(token, TOKEN_VARS.SECRET_KEY.value, [TOKEN_VARS.ALGORITHM.value])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except InvalidTokenError:
        raise credentials_exception
    user:User = get_helper.getUserAsModel(token_data.email)
    if user is None:
        raise credentials_exception
    return user


async def getUserIfActive(
    token: Token
):
    current_user:User = await getUserFromToken(token)
    if current_user.isDisabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def verifyPassword(plainText, hashed):
    return PWD_CONTEXT.verify(plainText, hashed)

def authenticateUser(email: str, password: str):
    user = get_helper.getUserAsModel(email)
    hashedPassword = get_helper.getUserHash(email)
    if not user or not verifyPassword(password, hashedPassword):
        return False
    return user

def createAccessToken(data: dict, expires_delta: timedelta | None = None):
    expire:datetime
    to_encode = data.copy()
   
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, TOKEN_VARS.SECRET_KEY.value, TOKEN_VARS.ALGORITHM.value)
    return (encoded_jwt, expire)

def hashPassword(password):
    return PWD_CONTEXT.hash(password)