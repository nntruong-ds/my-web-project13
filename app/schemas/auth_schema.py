from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str

class ForgotPasswordRequest(BaseModel):
    username: str
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    username: str
    new_password: str
    otp: str
