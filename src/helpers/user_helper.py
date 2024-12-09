from fastapi import Request

def isLoggedIn(request: Request):
    if not request.cookies.get('access_token'):
        return False
    return True

def getFirstname(request: Request):
    fName = request.cookies.get('first_name')
    if not fName:
        return ''
    return fName