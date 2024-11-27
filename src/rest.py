from fastapi import FastAPI, status, HTTPException, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, StringConstraints, ValidationError
from typing import Annotated
import sqlite3
from datetime import datetime





DATABASE = '/workspaces/codespaces-blank/database/main.db'

NameStr = Annotated[str, StringConstraints(pattern=r'^[a-zA-Z]{3,20}$')]


class Register(BaseModel):
    fName: NameStr
    lName: NameStr
    email: EmailStr
    model_config = {"extra": "forbid"}



restAPI = FastAPI()

@restAPI.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )

@restAPI.post('/register')
async def register(data: Register):
    registrationDate = datetime.now()
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        try:
            cursor.execute('INSERT INTO Registrations(F_Name, L_Name, Email, Registration_Date) VALUES(?, ?, ?, ?)',
                            (data.fName, data.lName, data.email, registrationDate))
            conn.commit()
        except sqlite3.DatabaseError as e:
            return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Database Error')
        finally:
            cursor.close()
            return JSONResponse(
                status_code=status.HTTP_201_CREATED,
                content=jsonable_encoder(data)
            )
        

@restAPI.put('/registration/delete/{email}')
def deleteRegistration(email:str):
    email = str(email)
    print(email, type(email))
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        try:
            cursor.execute('DELETE FROM Registrations WHERE Email=?', (email,))
            conn.commit()
        except sqlite3.DatabaseError as e:
            print(e)

        cursor.close()