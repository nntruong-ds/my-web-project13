from datetime import datetime, time
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.cham_cong import ChamCong

# Giờ chuẩn công ty
GIO_VAO_CHUAN = time(8, 0, 0)
GIO_RA_CHUAN = time(17, 0, 0)

def check_in(db: Session, ma_nhan_vien: int):
    today = datetime.now().date()

    record = db.query(ChamCong).filter(
        ChamCong.ma_nhan_vien == ma_nhan_vien,
        ChamCong.ngay == today
    ).first()

    if record:
        raise HTTPException(status_code=400, detail="Hôm nay đã check in rồi")

    now = datetime.now()
    trang_thai = "DI_LAM"

    if now.time() > GIO_VAO_CHUAN:
        trang_thai = "DI_MUON"

    new_record = ChamCong(
        ma_nhan_vien=ma_nhan_vien,
        ngay=today,
        gio_vao=now,
        trang_thai=trang_thai
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


def check_out(db: Session, ma_nhan_vien: int):
    today = datetime.now().date()

    record = db.query(ChamCong).filter(
        ChamCong.ma_nhan_vien == ma_nhan_vien,
        ChamCong.ngay == today
    ).first()

    if not record:
        raise HTTPException(status_code=400, detail="Chưa check in trong hôm nay")

    if record.gio_ra:
        raise HTTPException(status_code=400, detail="Đã check out rồi")

    now = datetime.now()
    record.gio_ra = now

    # Tính số giờ làm
    so_gio = (now - record.gio_vao).total_seconds() / 3600
    record.so_gio_lam = round(so_gio, 2)

    # Xác định trạng thái
    if now.time() < GIO_RA_CHUAN:
        record.trang_thai = "VE_SOM"
    elif so_gio >= 8:
        record.trang_thai = "DI_LAM"
    else:
        record.trang_thai = "DI_LAM"

    db.commit()
    db.refresh(record)

    return record
