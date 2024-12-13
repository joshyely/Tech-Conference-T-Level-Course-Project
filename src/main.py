# Libraries
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import json
import urllib.parse
# Files
from rest.main import restAPI
from helpers import user_helper


app = FastAPI()
app.mount('/rest', restAPI)

app.mount('/static', StaticFiles(directory='static'), name='static')
templates = Jinja2Templates(directory='templates')

@app.get('/')
def home(request: Request):
    isLoggedIn = user_helper.isLoggedIn(request)
    if isLoggedIn:
        fName = user_helper.getFirstname(request)
        return templates.TemplateResponse('pages/home.html', {'request': request, 'STATIC_PREFIX': '/', 'isLoggedIn': True, 'firstName': fName})
    else:
        return templates.TemplateResponse('pages/home.html', {'request': request, 'STATIC_PREFIX': '/', 'isLoggedIn': False})

@app.get('/register')
def register(request: Request):
    return templates.TemplateResponse('pages/register.html', {'request': request, 'STATIC_PREFIX': '../'})

@app.get('/confirmation/{registrationDataString}')
def confirmation(request: Request, registrationDataString: str):
    decoded_data = urllib.parse.unquote(registrationDataString)
        
    # Parse the decoded JSON string into a Python dictionary
    registrationData = json.loads(decoded_data)
    
    # Render the confirmation page template with the parsed data
    isLoggedIn = user_helper.isLoggedIn(request)
    return templates.TemplateResponse('pages/confirmation.html', {'request': request, 'STATIC_PREFIX': '../', 'registrationData': registrationData, 'isLoggedIn': isLoggedIn})

@app.get('/login')
def login(request: Request):
    return templates.TemplateResponse('pages/login.html', {'request': request, 'STATIC_PREFIX': '../'})

@app.get('/profile')
def profile(request: Request):
    isLoggedIn = user_helper.isLoggedIn(request)
    if isLoggedIn:
        return templates.TemplateResponse('pages/profile.html', {'request': request, 'STATIC_PREFIX': '../', 'isLoggedIn': True})
    else:
        return templates.TemplateResponse('pages/profile_error.html', {'request': request, 'STATIC_PREFIX': '../', 'isLoggedIn': False})
    
@app.get('/testing')
def testing(request: Request):
    return templates.TemplateResponse('dev_pages/js_tests.html', {'request': request, 'STATIC_PREFIX': '/'})