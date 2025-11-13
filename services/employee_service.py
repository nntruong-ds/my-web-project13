from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException

def get_profile(db: Session, username: str):
    profile = db.execute(
        text("SELECT * FROM nhan_vien WHERE ma_nhan_vien=:username"),
        {"username": username}
    ).fetchone()
    if not profile:
        raise HTTPException(status_code=404, detail="Nhân viên không tồn tại")
    return dict(profile._mapping)  # chuẩn hơn fetchone()._mapping


def update_profile(db: Session, username: str, email: str = None, so_dien_thoai: str = None, dia_chi: str = None):
    user = db.execute(
        text("SELECT * FROM nhan_vien WHERE ma_nhan_vien=:username"),
        {"username": username}
    ).fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="Nhân viên không tồn tại")

    # Chuẩn bị các trường cập nhật
    update_fields = {}
    if email:
        update_fields["email"] = email
    if so_dien_thoai:
        update_fields["so_dien_thoai"] = so_dien_thoai
    if dia_chi:
        update_fields["dia_chi"] = dia_chi

    if not update_fields:
        raise HTTPException(status_code=400, detail="Không có trường nào để cập nhật")

    # Ghép câu lệnh SQL động
    set_clause = ", ".join(f"{key}=:{key}" for key in update_fields.keys())
    update_fields["username"] = username

    db.execute(
        text(f"UPDATE nhan_vien SET {set_clause} WHERE ma_nhan_vien=:username"),
        update_fields
    )
    db.commit()

    # Trả về dữ liệu mới
    updated_user = db.execute(
        text("SELECT * FROM nhan_vien WHERE ma_nhan_vien=:username"),
        {"username": username}
    ).fetchone()
    return dict(updated_user._mapping)
