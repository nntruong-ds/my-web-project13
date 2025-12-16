from sqlalchemy.orm import Session
from app.models.luong_nhan_vien import LuongNhanVien
from app.services.bang_cong_service import tinh_bang_cong
from app.models.luong import Luong  # bảng lưu lịch sử lương
from datetime import datetime

def tinh_luong(db: Session, ma_nhan_vien: str, month: int, year: int):

    # 1. Lấy dữ liệu công tháng
    cong = tinh_bang_cong(db, ma_nhan_vien, month, year)

    tong_cong = cong["tong_cong"]
    lam_them = cong["lam_them"]
    di_muon = cong["di_muon"]
    ve_som = cong["ve_som"]
    nghi = cong["nghi"]

    # 2. Lấy cấu hình lương nhân viên
    luong_nv = db.query(LuongNhanVien).filter(
        LuongNhanVien.ma_nhan_vien == ma_nhan_vien
    ).first()

    if not luong_nv:
        raise Exception("Không tìm thấy cấu hình lương cho nhân viên này")

    # 3. Tính lương theo công thức chuẩn
    luong_cong = (luong_nv.luong_co_ban / 26) * tong_cong
    luong_ot = lam_them * luong_nv.ot_rate
    tien_phu_cap = luong_nv.phu_cap
    tien_phat = di_muon * luong_nv.phat_di_muon + ve_som * luong_nv.phat_ve_som

    tong_luong = luong_cong + luong_ot + tien_phu_cap - tien_phat

    # 4. Lưu vào bảng lương tháng (bảng `luong`)
    new_salary = Luong(
        ma_nhan_vien = ma_nhan_vien,
        thang = month,
        nam = year,
        luong_co_ban = luong_nv.luong_co_ban,
        phu_cap = tien_phu_cap,
        thuong = 0,
        khau_tru = tien_phat,
        tong_luong = tong_luong,
        ghi_chu = None,
        he_so_luong = luong_nv.he_so_luong
    )

    db.add(new_salary)
    db.commit()
    db.refresh(new_salary)

    # 5. Trả JSON
    return {
        "ma_nhan_vien": ma_nhan_vien,
        "thang": f"{year}-{month:02d}",
        "luong_co_ban": luong_nv.luong_co_ban,
        "phu_cap": luong_nv.phu_cap,

        "tong_cong": tong_cong,
        "lam_them": lam_them,
        "di_muon": di_muon,
        "ve_som": ve_som,
        "nghi": nghi,

        "luong_cong": round(luong_cong),
        "luong_ot": round(luong_ot),
        "tien_phu_cap": round(tien_phu_cap),
        "tien_phat": round(tien_phat),

        "tong_luong": round(tong_luong)
    }
