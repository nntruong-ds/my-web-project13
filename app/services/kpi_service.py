from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import date


# =====================================================
# 1️⃣ GET KPI NHÂN VIÊN
# =====================================================
def get_kpi_nhan_vien(
    db: Session,
    ma_nhan_vien: str,
    thang: int,
    nam: int
):
    rows = db.execute(
        text("""
            SELECT
                ten_kpi,
                muc_tieu,
                thuc_te,
                ty_le_hoan_thanh,
                trang_thai,
                don_vi_tinh,
                ghi_chu
            FROM kpi_nhan_vien
            WHERE ma_nhan_vien = :ma
              AND thang = :thang
              AND nam = :nam
        """),
        {
            "ma": ma_nhan_vien,
            "thang": thang,
            "nam": nam
        }
    ).fetchall()

    if not rows:
        return {
            "message": "Chưa có dữ liệu KPI cho tháng này",
            "data": []
        }

    return {
        "message": "Lấy KPI thành công",
        "data": [
            {
                "ten_kpi": r.ten_kpi,
                "muc_tieu": r.muc_tieu,
                "thuc_te": r.thuc_te,
                "ty_le_hoan_thanh": r.ty_le_hoan_thanh,
                "trang_thai": r.trang_thai,
                "don_vi_tinh": r.don_vi_tinh,
                "ghi_chu": r.ghi_chu
            }
            for r in rows
        ]
    }


# =====================================================
# 2️⃣ UPDATE KPI CHUYÊN CẦN
# =====================================================
def update_kpi_chuyen_can(
    db: Session,
    ma_nhan_vien: str,
    thang: int,
    nam: int,
    ghi_chu: str | None = None
):
    TEN_KPI = "Chuyên cần"
    MUC_TIEU = 26
    DON_VI = "ngày"

    # 1️⃣ Đếm số ngày đi làm đúng giờ
    row = db.execute(
        text("""
            SELECT COUNT(*) AS tong_ngay
            FROM cham_cong
            WHERE ma_nhan_vien = :ma
              AND MONTH(ngay) = :thang
              AND YEAR(ngay) = :nam
              AND trang_thai = 'Đi làm'
              AND so_lan_di_muon_ve_som = 0
        """),
        {
            "ma": ma_nhan_vien,
            "thang": thang,
            "nam": nam
        }
    ).fetchone()

    thuc_te = row.tong_ngay if row else 0

    # 2️⃣ Tính tỷ lệ hoàn thành
    ty_le = round((thuc_te / MUC_TIEU) * 100, 2)
    ty_le = min(ty_le, 100)

    # 3️⃣ Xác định trạng thái
    today = date.today()
    if nam > today.year or (nam == today.year and thang >= today.month):
        trang_thai = "dang_danh_gia"
    else:
        trang_thai = "dat" if ty_le >= 80 else "khong_dat"

    # 4️⃣ UPSERT KPI
    db.execute(
        text("""
            INSERT INTO kpi_nhan_vien (
                ma_nhan_vien,
                ten_kpi,
                muc_tieu,
                thuc_te,
                don_vi_tinh,
                ghi_chu,
                trang_thai,
                thang,
                nam
            )
            VALUES (
                :ma, :ten_kpi, :muc_tieu, :thuc_te,
                :don_vi, :ghi_chu, :trang_thai,
                :thang, :nam
            )
            ON DUPLICATE KEY UPDATE
                muc_tieu = VALUES(muc_tieu),
                thuc_te = VALUES(thuc_te),
                don_vi_tinh = VALUES(don_vi_tinh),
                ghi_chu = VALUES(ghi_chu),
                trang_thai = VALUES(trang_thai)
        """),
        {
            "ma": ma_nhan_vien,
            "ten_kpi": TEN_KPI,
            "muc_tieu": MUC_TIEU,
            "thuc_te": thuc_te,
            "don_vi": DON_VI,
            "ghi_chu": ghi_chu,
            "trang_thai": trang_thai,
            "thang": thang,
            "nam": nam
        }
    )

    # 5️⃣ Nếu ĐẠT KPI → THƯỞNG
    if trang_thai == "dat":
        insert_thuong_kpi(
            db=db,
            ma_nhan_vien=ma_nhan_vien,
            thang=thang,
            nam=nam,
            ly_do="Hoàn thành KPI chuyên cần"
        )

    db.commit()

    return {
        "message": "Cập nhật KPI Chuyên cần thành công",
        "data": {
            "ma_nhan_vien": ma_nhan_vien,
            "thuc_te": thuc_te,
            "muc_tieu": MUC_TIEU,
            "ty_le_hoan_thanh": ty_le,
            "trang_thai": trang_thai
        }
    }


# =====================================================
# 3️⃣ INSERT THƯỞNG KPI
# =====================================================
def insert_thuong_kpi(
    db: Session,
    ma_nhan_vien: str,
    thang: int,
    nam: int,
    ly_do: str | None = None
):
    row = db.execute(
        text("""
            SELECT MAX(ngay) AS ngay_cuoi
            FROM cham_cong
            WHERE ma_nhan_vien = :ma
              AND MONTH(ngay) = :thang
              AND YEAR(ngay) = :nam
        """),
        {"ma": ma_nhan_vien, "thang": thang, "nam": nam}
    ).fetchone()

    if not row or not row.ngay_cuoi:
        return

    exists = db.execute(
        text("""
            SELECT 1 FROM khen_thuong_ky_luat
            WHERE ma_nhan_vien = :ma
              AND loai = 'Khen thưởng'
              AND hinh_thuc = 'Thưởng KPI'
              AND thang = :thang
        """),
        {"ma": ma_nhan_vien, "thang": thang}
    ).fetchone()

    if exists:
        return

    db.execute(
        text("""
            INSERT INTO khen_thuong_ky_luat (
                ma_nhan_vien,
                loai,
                ngay,
                hinh_thuc,
                ly_do,
                so_tien,
                thang
            )
            VALUES (
                :ma,
                'Khen thưởng',
                :ngay,
                'Thưởng KPI',
                :ly_do,
                5000000,
                :thang
            )
        """),
        {
            "ma": ma_nhan_vien,
            "ngay": row.ngay_cuoi,
            "ly_do": ly_do,
            "thang": thang
        }
    )
