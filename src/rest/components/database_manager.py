# Interacts directly with the database

# Libraries
import sqlite3
from sqlite3 import DatabaseError
from datetime import datetime
# Files
from .base_models import UserInDB, UserRegister
from .exceptions import UserExists


DB_PATH = '/workspaces/codespaces-blank/database/main.db'

def addUser(user: UserRegister):
    def userExists(email: str):
        cursor.execute('SELECT * FROM Users WHERE Email=?', (email,))
        user = cursor.fetchone()
        if not user:
            return False
        return True

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

            if userExists(user.email):
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





def getUser(email: str):
    with sqlite3.connect(DB_PATH) as conn:
        try:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM Users WHERE Email=?', (email,))
            user = cursor.fetchone()
            return user
        except sqlite3.DatabaseError as e:
            raise sqlite3.DatabaseError
        except Exception as e:
            print(e)
        cursor.close()

def getUserSafeInfo(email: str):
    with sqlite3.connect(DB_PATH) as conn:
        try:
            cursor = conn.cursor()
            cursor.execute('SELECT UserID, F_Name, L_Name, Email, Registration_Date, isDisabled FROM Users WHERE Email=?', (email,))
            user = cursor.fetchone()
            return user
        except sqlite3.DatabaseError as e:
            raise sqlite3.DatabaseError
        except Exception as e:
            print(e)
        cursor.close()

def getUserHash(email: str):
    with sqlite3.connect(DB_PATH) as conn:
        try:
            cursor = conn.cursor()
            cursor.execute('SELECT Hashed_Password FROM Users WHERE Email=?', (email,))
            user = cursor.fetchone()
            return user
        except sqlite3.DatabaseError as e:
            raise sqlite3.DatabaseError
        except Exception as e:
            print(e)
        cursor.close()


def deleteUser(email: str):
    with sqlite3.connect(DB_PATH) as conn:
        try:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM Users WHERE Email=?', (email,))
            conn.commit()
        except sqlite3.DatabaseError as e:
            raise sqlite3.DatabaseError
        except Exception as e:
            print(e)
        cursor.close()

def changePassword(email: str, hashedPassword: str):
    with sqlite3.connect(DB_PATH) as conn:
        try:
            cursor = conn.cursor()
            cursor.execute('UPDATE Users Hashed_Password=? WHERE Email=?', (hashedPassword, email))
        except:
            pass

