from ..services import auth_service

def register(db, username, password):
    return auth_service.register_user(db, username, password)

def login(db, username, password):
    return auth_service.login_user(db, username, password)
