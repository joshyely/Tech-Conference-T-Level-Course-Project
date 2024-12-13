# Handles requests that require a user to be logged in

# Libaries
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
# Files
from rest.components.base_models import Token, User, PasswordPlusToken, NewPassword, NewEmail, TokenData
from rest.components.helpers import auth_helper
from rest.components import database_manager
from rest.components.constants import HTTP_EXCEPTIONS
from rest.components.exceptions import UserExists

async def passwordPlusTokenAuthenticate(form):
    token_data:TokenData = await auth_helper.authenticateToken(form.token)
    if not token_data:
        raise HTTP_EXCEPTIONS.TOKEN.value
    user: User = auth_helper.authenticateUser(token_data.userID, form.password)
    if not user:
        raise HTTP_EXCEPTIONS.INVALID_CREDENTIALS.value
    else:
        return user
    
 

authApp = FastAPI()

@authApp.post('/user/info')
async def acknowledgeToken(token: Token):
    current_user:User = await auth_helper.getUserIfActive(token)
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder({'detail': 'Authorised', 'current_user': vars(current_user)})
    )

@authApp.post('/user/change-password')
async def changePassword(newPasswordForm: NewPassword):
    user: User = await passwordPlusTokenAuthenticate(newPasswordForm)
    try:
        hashedNewPassword = auth_helper.hashPassword(newPasswordForm.newPassword)
        database_manager.changePassword(hashedNewPassword, email=user.email)
    except database_manager.DatabaseError:
        return HTTP_EXCEPTIONS.DATABASE.value
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder({'detail': 'Password Changed'})
    )       

@authApp.post('/user/change-email')
async def changeEmail(newEmailForm: NewEmail):
    user: User = await passwordPlusTokenAuthenticate(newEmailForm)
    try:
        database_manager.changeEmail(newEmailForm.newEmail, email=user.email)
    except database_manager.DatabaseError:
        raise HTTP_EXCEPTIONS.DATABASE.value
    except UserExists:
        return HTTP_EXCEPTIONS.EMAIL_USED.value
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder({'detail': 'Email changed'})
    ) 


@authApp.post('/user/delete')
async def deleteUser(passwordPlusToken: PasswordPlusToken):
    user: User = await passwordPlusTokenAuthenticate(passwordPlusToken)
    try:
        database_manager.deleteUser(email=user.email)
    except database_manager.DatabaseError:
        return HTTP_EXCEPTIONS.DATABASE.value
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content=jsonable_encoder({'detail': 'User Deleted'})
    )   