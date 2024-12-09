# Libraries
import re

def validatePassword(value):
    # Check if the password contains at least one lowercase letter
    if not re.search(r'[a-z]', value):
        raise ValueError('Password must contain at least one lowercase letter.')
    # Check if the password contains at least one uppercase letter
    if not re.search(r'[A-Z]', value):
        raise ValueError('Password must contain at least one uppercase letter.')
    # Check if the password contains at least one digit
    if not re.search(r'\d', value):
        raise ValueError('Password must contain at least one digit.')
    # Check if the password contains at least one special character
    if not re.search(r'[\W_]', value):
        raise ValueError('Password must contain at least one special character.')
    # Check if the password length is at least 8 characters
    if len(value) < 8:
        raise ValueError('Password must be at least 8 characters long.')
    return value