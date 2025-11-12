from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.utils.hash_md5 import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
from app.utils.email_sender import send_reset_email
import random

otp_cache = {}  # lưu OTP tạm trong RAM
token_blocklist = set()  # tạm lưu token logout

def login(data, db: Session):
    user = db.execute(
        text("SELECT * FROM users WHERE TenDangNhap=:username"),
        {"username": data.username}
    ).fetchone()
    if not user or not verify_password(data.password, user.MatKhau):
        raise HTTPException(status_code=401, detail="Sai tên đăng nhập hoặc mật khẩu")

    token = create_access_token({"username": user.TenDangNhap, "role": user.VaiTro})
    return {"access_token": token, "role": user.VaiTro}

def logout(token: str):
    token_blocklist.add(token)
    return {"message": "Đăng xuất thành công"}

def forgot_password(data, db: Session):
    # Lấy user từ bảng users
    user = db.execute(
        text("SELECT * FROM users WHERE TenDangNhap=:username"),
        {"username": data.username}
    ).fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")

    # Lấy email từ bảng nhan_vien
    nhanvien = db.execute(
        text("SELECT email FROM nhan_vien WHERE ma_nhan_vien=:ma"),
        {"ma": data.username}
    ).fetchone()
    if not nhanvien or not nhanvien.email:
        raise HTTPException(status_code=404, detail="Không tìm thấy email nhân viên")

    otp = str(random.randint(100000, 999999))
    otp_cache[user.TenDangNhap] = otp

    # Gửi email OTP (debug=True sẽ in ra console)
    send_reset_email(nhanvien.email, otp, debug=True)
    return {"message": "OTP đã được gửi đến email nhân viên"}

def reset_password(data, db: Session):
    otp_saved = otp_cache.get(data.username)
    if otp_saved != data.otp:
        raise HTTPException(status_code=400, detail="OTP không hợp lệ")

    hashed_new = hash_password(data.new_password)
    db.execute(
        text("UPDATE users SET MatKhau=:newpass WHERE TenDangNhap=:username"),
        {"newpass": hashed_new, "username": data.username}
    )
    db.commit()
    del otp_cache[data.username]
    return {"message": "Đặt lại mật khẩu thành công"}
