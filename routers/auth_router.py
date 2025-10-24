from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..controllers import auth_controller
from ..configs.database import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

class RegisterRequest(BaseModel):
    username: str
    password: str

@router.post("/register")
def register_user(data: RegisterRequest, db: Session = Depends(get_db)):
    return auth_controller.register(db=db, username=data.username, password=data.password)

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login_user(data: LoginRequest, db: Session = Depends(get_db)):
    return auth_controller.login(db=db, username=data.username, password=data.password)
