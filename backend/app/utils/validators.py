import re

def validate_email(email):
    """Valdiates an email via regex. Returns True if valid."""
    if not email:
        return False
    # Standard simplistic regex for email
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validates that a password is at least 6 characters long."""
    if not password or len(password) < 6:
        return False
    return True
