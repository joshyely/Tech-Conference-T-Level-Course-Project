# Helper functions for getting data and storing it in the wanted/corrrect format

# Files
from ..base_models import User
from .. import database_manager


# Gets the user from the database and turns it into a UserInDB object to be used in other functions
def getUserAsModel(email: str):
    user = database_manager.getUserSafeInfo(email)
    if not user:
        return False
    
    return User(
        UserID=user[0],
        fName=user[1],
        lName=user[2],
        email=user[3],
        dateRegistered=user[4],
        isDisabled=user[5]
    )

def getUserHash(email: str):
    hashedPassword = database_manager.getUserHash(email)
    if not hashedPassword:
        return False
    else:
        return hashedPassword[0]




