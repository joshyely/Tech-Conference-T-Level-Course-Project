# Interacts directly with the database

# Libraries
import sqlite3
from sqlite3 import DatabaseError
from datetime import datetime
# Files
from .base_models import UserInDB, UserRegister
from .exceptions import UserExists


DB_PATH = '/workspaces/codespaces-blank/database/main.db'


def __userExists__(cursor:sqlite3.Cursor, email: str):
    cursor.execute('SELECT * FROM Users WHERE Email=?', (email,))
    user = cursor.fetchone()
    print(f'userExists: {user}')
    if not user:
        return False
    return True

def addUser(user: UserRegister):
    params = (
        user.fName,
        user.lName,
        user.email,
        user.password,
        datetime.now()
    )
    with sqlite3.connect(DB_PATH) as conn:
        try:
            cursor = conn.cursor()
            if __userExists__(cursor, user.email):
                raise UserExists
            cursor.execute('''INSERT INTO Users
                        (F_Name, L_Name, Email, Hashed_Password, Registration_Date)
                        VALUES (?, ?, ?, ?, ?)
                        ''', params)
            conn.commit()
        except DatabaseError as e:
            raise DatabaseError
        except UserExists:
            raise UserExists
        except Exception as e:
            print(e)
        cursor.close()





def getUser(*, userID:int|None=None, email:str|None=None):
    with sqlite3.connect(DB_PATH) as conn:
        try:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM Users WHERE UserID=? OR Email=?', (userID, email))
            user = cursor.fetchone()
            return user
        except sqlite3.DatabaseError as e:
            raise sqlite3.DatabaseError
        except Exception as e:
            print(e)
        cursor.close()

def getUserSafeInfo(*, userID:int|None=None, email:str|None=None):
    with sqlite3.connect(DB_PATH) as conn:
        try:
            cursor = conn.cursor()
            cursor.execute('SELECT UserID, F_Name, L_Name, Email, Registration_Date, isDisabled FROM Users WHERE UserID=? OR Email=?', (userID, email))
            user = cursor.fetchone()
            return user
        except sqlite3.DatabaseError as e:
            raise sqlite3.DatabaseError
        except Exception as e:
            print(e)
        cursor.close()

def getUserHash(*, userID:int|None=None, email:str|None=None):
    with sqlite3.connect(DB_PATH) as conn:
        try:
            cursor = conn.cursor()
            cursor.execute('SELECT Hashed_Password FROM Users WHERE Email=? OR UserID=?', (email, userID))
            user = cursor.fetchone()
            return user
        except sqlite3.DatabaseError as e:
            raise sqlite3.DatabaseError
        except Exception as e:
            print(e)
        cursor.close()


def deleteUser(*, userID:int|None=None, email:str|None=None):
    with sqlite3.connect(DB_PATH) as conn:
        try:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM Users WHERE Email=? OR UserID=?', (email, userID))
            conn.commit()
        except sqlite3.DatabaseError as e:
            raise sqlite3.DatabaseError
        except Exception as e:
            print(e)
        cursor.close()

def changePassword(hashedPassword: str, *, userID:int|None=None, email:str|None=None):
    with sqlite3.connect(DB_PATH) as conn:
        try:
            cursor = conn.cursor()
            cursor.execute('UPDATE Users SET Hashed_Password=? WHERE Email=? OR UserID=?', (hashedPassword, email, userID))
            conn.commit()
        except sqlite3.DatabaseError as e:
            raise sqlite3.DatabaseError
        except Exception as e:
            print(e)
        cursor.close()

def changeEmail(newEmail: str, *, userID:int|None=None, email:str|None=None):
    with sqlite3.connect(DB_PATH) as conn:
        try:
            cursor = conn.cursor()
            if __userExists__(cursor, newEmail):
                print('user exists!')
                raise UserExists
            cursor.execute('UPDATE Users SET Email=? WHERE Email=? OR UserID=?', (newEmail, email, userID))
            conn.commit()
        except sqlite3.DatabaseError as e:
            raise sqlite3.DatabaseError
        except UserExists:
            raise UserExists
        except Exception as e:
            print(e)
        cursor.close()

