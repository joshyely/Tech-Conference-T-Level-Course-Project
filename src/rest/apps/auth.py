# Handles requests that require a user to be logged in

# Libaries
from fastapi import FastAPI, status, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
# Files
from rest.components.base_models import Token, User
from rest.components.helpers import auth_helper
from rest.components import database_manager
from rest.components.constants import ValidFields


authApp = FastAPI()

@authApp.post('/user/info')
async def acknowledgeToken(token: Token):
    current_user:User = await auth_helper.getUserIfActive(token)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder({'detail': 'Authorised', 'current_user': vars(current_user)})
    )

@authApp.post('/user/reset-password')
async def resetPassword(token: Token, oldPassword: str, newPassword: ValidFields.PASS.value):
    userFromToken:User = await auth_helper.getUserIfActive(token)
    user: User = await auth_helper.authenticateUser(userFromToken.email, oldPassword)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect Credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    else:
        try:
            hashedNewPassword = auth_helper.hashPassword(newPassword)
            database_manager.changePassword(user.email, hashedNewPassword)
        except database_manager.DatabaseError:
            return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Database Error')
        finally:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content=jsonable_encoder({'detail': 'Password Changed'})
            )       

@authApp.post('/user/delete')
async def deleteUser(token: Token):
    try:
        current_user:User = await auth_helper.getUserIfActive(token)
        database_manager.deleteUser(current_user.email)
    except database_manager.DatabaseError:
        return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Database Error')
    finally:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=jsonable_encoder({'detail': 'User Deleted'})
        )   