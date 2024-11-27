from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import json
import urllib.parse

from rest import restAPI

app = FastAPI()
app.mount('/static', StaticFiles(directory='static'), name='static')
templates = Jinja2Templates(directory='templates')

app.mount('/api', restAPI)

@app.get('/')
def home(request: Request):
    return templates.TemplateResponse('pages/home.html', {'request': request, 'STATIC_PREFIX': '/'})

@app.get('/register')
def register(request: Request):
    return templates.TemplateResponse('pages/register.html', {'request': request, 'STATIC_PREFIX': '/'})

@app.get('/confirmation/{registrationDataString}')
def confirmation(request: Request, registrationDataString: str):
    decoded_data = urllib.parse.unquote(registrationDataString)
        
    # Parse the decoded JSON string into a Python dictionary
    registrationData = json.loads(decoded_data)
    
    # Render the confirmation page template with the parsed data
    return templates.TemplateResponse('pages/confirmation.html', {'request': request, 'STATIC_PREFIX': '../', 'registrationData': registrationData})