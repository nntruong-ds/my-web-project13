from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException


def get_profile(db: Session, ma_nhan_vien: str):
    result = db.execute(
        text("SELECT * FROM nhan_vien WHERE ma_nhan_vien = :u"),
        {"u": ma_nhan_vien}
    ).mappings().first()

    if not result:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhân viên")

    return result


def update_profile(db: Session, ma_nhan_vien: str, data: dict):

    # Kiểm tra tồn tại
    old = db.execute(
        text("SELECT * FROM nhan_vien WHERE ma_nhan_vien = :u"),
        {"u": ma_nhan_vien}
    ).mappings().first()

    if not old:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhân viên")

    # Tạo câu update
    set_clause = ", ".join([f"{field} = :{field}" for field in data.keys()])
    data["u"] = ma_nhan_vien

    db.execute(
        text(f"UPDATE nhan_vien SET {set_clause} WHERE ma_nhan_vien = :u"),
        data
    )
    db.commit()

    # Trả về bản ghi sau khi update
    updated = db.execute(
        text("SELECT * FROM nhan_vien WHERE ma_nhan_vien = :u"),
        {"u": ma_nhan_vien}
    ).mappings().first()

    return updated
