# Libraries
from fastapi import FastAPI
# Files
from rest.apps.login import loginApp
from rest.apps.registration import registrationApp
from rest.apps.auth import authApp

restAPI = FastAPI()
restAPI.mount('/login', loginApp)
restAPI.mount('/registration', registrationApp)
restAPI.mount('/auth', authApp)


