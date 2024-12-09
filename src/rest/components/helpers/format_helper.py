# Helper functions for formatting data

# Libraries
from datetime import datetime

def dateFrontendFormat(date: datetime|str) -> str:
    return date.strftime('%a, %d %b %Y %X UTC')