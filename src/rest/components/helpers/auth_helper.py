# Contains helper functions that authenticate a user. Used by login.py and auth.py

# Libraries
from typing import Annotated
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi import HTTPException, status, Depends
from datetime import datetime, timedelta, timezone
import traceback
# Files
from ..base_models import User, TokenData, Token
from ..constants import TOKEN_VARS, PWD_CONTEXT, HTTP_EXCEPTIONS
from . import get_helper

async def authenticateToken(token: Annotated[str, Depends(TOKEN_VARS.OAUTH2_SCHEME.value)]):
    token = str(token).replace("token_type='bearer'", "").replace("access_token=", "").replace("'", "").strip()
    try:
        payload = jwt.decode(token, TOKEN_VARS.SECRET_KEY.value, [TOKEN_VARS.ALGORITHM.value])
        userID: int = int(payload.get("sub"))
        if userID is None:
            raise HTTP_EXCEPTIONS.TOKEN.value
        token_data = TokenData(userID=userID)
    except InvalidTokenError as e:
        traceback.print_exc()
        raise HTTP_EXCEPTIONS.TOKEN.value
    return token_data
    

async def getUserFromToken(token: Token):
    token_data: TokenData = await authenticateToken(token)
    user:User = get_helper.getUserAsModel(token_data.userID)
    if user is None:
        raise HTTP_EXCEPTIONS.TOKEN.value
    return user

async def getUserIfActive(
    token: Token
):
    current_user:User = await getUserFromToken(token)
    if current_user.isDisabled:
        raise HTTP_EXCEPTIONS.INACTIVE_USER.value
    return current_user


def verifyPassword(plainText, hashed):
    return PWD_CONTEXT.verify(plainText, hashed)

def authenticateUser(identifier: int|str, password: str):
    hashedPassword = get_helper.getUserHash(identifier)
    user = get_helper.getUserAsModel(identifier)
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