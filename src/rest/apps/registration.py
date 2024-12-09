# Manages registration requests

# Libraries
from fastapi import FastAPI, status, HTTPException, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlite3 import DatabaseError
# Files
from ..components.base_models import UserRegister
from ..components import database_manager
from ..components.exceptions import UserExists
from rest.components.helpers import auth_helper

registrationApp = FastAPI()

@registrationApp.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )

@registrationApp.post('/register')
async def register(user: UserRegister):
    user.password = auth_helper.hashPassword(user.password)
    try:
        database_manager.addUser(user)
    except UserExists:
        return JSONResponse(
            status_code=status.HTTP_226_IM_USED,
            content=jsonable_encoder({"detail": 'User Exists'}),
        )
    except DatabaseError:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=jsonable_encoder({"detail": 'Database Error'}),
        )    
   
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=jsonable_encoder(user)
    )

