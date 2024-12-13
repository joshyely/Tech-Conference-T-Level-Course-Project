# Helper functions for getting data and storing it in the wanted/corrrect format

# Files
from ..base_models import User
from .. import database_manager


# Gets the user from the database and turns it into a UserInDB object to be used in other functions
def getUserAsModel(identifier:int|str):
    user: User
    if type(identifier) == str:
        user = database_manager.getUserSafeInfo(email=identifier)
    else:
        user = database_manager.getUserSafeInfo(userID=identifier)
    if not user:
        return False
    
    return User(
        userID=user[0],
        fName=user[1],
        lName=user[2],
        email=user[3],
        dateRegistered=user[4],
        isDisabled=user[5]
    )

def getUserHash(identifier:int|str):
    hashedPassword: str
    if type(identifier) == str:
        hashedPassword = database_manager.getUserHash(email=identifier)
    else:
        hashedPassword = database_manager.getUserHash(userID=identifier)
    
    if not hashedPassword:
        return False
    else:
        return hashedPassword[0]




