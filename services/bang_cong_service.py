from sqlalchemy.orm import Session
from app.models.cham_cong import ChamCong

def tinh_bang_cong(db: Session, ma_nhan_vien: str, month: int, year: int):
    records = db.query(ChamCong).filter(
        ChamCong.ma_nhan_vien == ma_nhan_vien,
        ChamCong.ngay >= f"{year}-{month:02d}-01",
        ChamCong.ngay <= f"{year}-{month:02d}-31"
    ).all()

    tong_cong = 0
    tong_lam_them = 0
    di_muon = 0
    ve_som = 0
    nghi = 0

    for r in records:
        # Công hưởng lương
        if r.so_gio_lam >= 8:
            tong_cong += 1
        elif r.so_gio_lam >= 4:
            tong_cong += 0.5

        # Làm thêm
        if r.so_gio_lam > 8:
            tong_lam_them += (r.so_gio_lam - 8)

        # Muộn / sớm
        if r.trang_thai == "DI_MUON":
            di_muon += 1
        if r.trang_thai == "VE_SOM":
            ve_som += 1

    # Ngày nghỉ = tổng số ngày trong tháng - ngày có record
    ngay_co_cong = len(records)
    nghi = 30 - ngay_co_cong  # đơn giản hóa

    return {
        "tong_cong": tong_cong,
        "lam_them": tong_lam_them,
        "di_muon": di_muon,
        "ve_som": ve_som,
        "nghi": nghi
    }
