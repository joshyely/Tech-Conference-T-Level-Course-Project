# Manages login requests, ensures the credentials are correct and creates and sends a token to the client

# Libraries
from datetime import datetime, timedelta, timezone
from typing import Annotated
import jwt
from fastapi import Depends, FastAPI, HTTPException, status, responses
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
# Files
from rest.components.base_models import Token, User, UserLogin
from rest.components.constants import TOKEN_VARS
from rest.components.helpers import auth_helper, format_helper



loginApp = FastAPI()


@loginApp.post('/token')
async def login(formData: UserLogin) -> Token:
    user = auth_helper.authenticateUser(formData.email, formData.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=TOKEN_VARS.ACCESS_TOKEN_EXPIRE_MINUTES.value)
    token, expire = auth_helper.createAccessToken(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    expireFrontend = format_helper.dateFrontendFormat(expire)
    response = JSONResponse(
        status_code=status.HTTP_302_FOUND,
        content=jsonable_encoder({'detail': 'Logged In', 'access_token': token, 'first_name': user.fName,'expires': expireFrontend}),
    )    
    return response

# Client will send token immediately after being issued with one to verify that it authenticates the user and there are no bugs
@loginApp.post('/acknowledge-token')
async def acknowledgeToken(token: Token):
    current_user:User = await auth_helper.getUserIfActive(token)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder({'detail': 'Authorised', 'current_user': vars(current_user)})
    )

