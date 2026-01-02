from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SecurityUtils:
    # Hàm kiểm tra mật khẩu (Login)
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        # Bcrypt giới hạn input 72 bytes. Nếu dài hơn -> Auto False (Sai pass)
        # Mã hóa sang utf-8 để đếm chính xác số byte (đặc biệt với tiếng Việt)
        if len(plain_password.encode('utf-8')) > 72:
            return False
        return pwd_context.verify(plain_password, hashed_password)

    # Hàm băm mật khẩu (Register/Reset Pass)
    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)