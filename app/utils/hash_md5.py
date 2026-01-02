import hashlib

def hash_password(password: str) -> str:
    """Hash password bằng MD5"""
    return hashlib.md5(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """So sánh password MD5"""
    return hash_password(plain_password) == hashed_password
