from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Union, Any

from app.configs.settings import settings

class JWTUtils:
    # Hàm tạo JWT Token (Login thành công thì gọi cái này)
    @staticmethod
    def create_access_token(subject: Union[str, Any]) -> str:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        # Payload: Dữ liệu nhét vào token
        to_encode = {"exp": expire, "sub": str(subject)}
        
        # Tạo chữ ký
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    # Giải mã và kiểm tra Token
    @staticmethod
    def verify_token(token: str):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload
        except JWTError:
            return None