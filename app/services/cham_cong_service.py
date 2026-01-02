from datetime import date, datetime, time
from sqlalchemy.orm import Session
from sqlalchemy import text, extract

GIO_VAO_CHUAN = time(8, 0)
GIO_RA_CHUAN = time(17, 0)

def check_in(db: Session, ma_nv: str):
    today = date.today()

    existed = db.execute(
        text("""
            SELECT 1 FROM cham_cong
            WHERE ma_nhan_vien=:ma AND ngay=:ngay
        """),
        {"ma": ma_nv, "ngay": today}
    ).fetchone()

    if existed:
        raise ValueError("Hôm nay đã check-in")

    db.execute(
        text("""
            INSERT INTO cham_cong(ma_nhan_vien, ngay, gio_vao, trang_thai, so_lan_di_muon_ve_som)
            VALUES (:ma, :ngay, :gio_vao, 'Đi làm', 0)
        """),
        {
            "ma": ma_nv,
            "ngay": today,
            "gio_vao": datetime.now().time()
        }
    )
    db.commit()
    return {"message": "Check-in thành công"}

def check_out(db: Session, ma_nv: str):
    today = date.today()
    now_dt = datetime.now()          # datetime hiện tại
    now_time = now_dt.time()

    row = db.execute(
        text("""
            SELECT gio_vao
            FROM cham_cong
            WHERE ma_nhan_vien = :ma
              AND ngay = :ngay
        """),
        {"ma": ma_nv, "ngay": today}
    ).fetchone()

    if not row or not row.gio_vao:
        raise ValueError("Hôm nay chưa check-in")

    # 🔁 gio_vao MySQL (TIME) → timedelta → datetime
    gio_vao_td = row.gio_vao
    gio_vao_dt = datetime.combine(
        today,
        (datetime.min + gio_vao_td).time()
    )

    # ⏱️ 1️⃣ TÍNH SỐ GIỜ LÀM
    so_gio_lam = round(
        (now_dt - gio_vao_dt).total_seconds() / 3600,
        2
    )

    # ⏱️ 2️⃣ TÍNH GIỜ TĂNG CA (KHÔNG OT → 0)
    gio_ra_chuan_dt = datetime.combine(today, GIO_RA_CHUAN)
    so_gio_tang_ca = max(
        0,
        round((now_dt - gio_ra_chuan_dt).total_seconds() / 3600, 2)
    )

    # 🚨 3️⃣ TÍNH VI PHẠM
    vi_pham = 0
    if gio_vao_dt.time() > GIO_VAO_CHUAN:
        vi_pham += 1
    if now_time < GIO_RA_CHUAN:
        vi_pham += 1

    # 🔥 4️⃣ UPDATE – KHÔNG ĐỂ NULL
    db.execute(
        text("""
            UPDATE cham_cong
            SET gio_ra = :gio_ra,
                so_gio_lam = :so_gio_lam,
                so_gio_tang_ca = :so_gio_tang_ca,
                so_lan_di_muon_ve_som = so_lan_di_muon_ve_som + :vp
            WHERE ma_nhan_vien = :ma
              AND ngay = :ngay
        """),
        {
            "gio_ra": now_time,
            "so_gio_lam": so_gio_lam,
            "so_gio_tang_ca": so_gio_tang_ca,
            "vp": vi_pham,
            "ma": ma_nv,
            "ngay": today
        }
    )
    db.commit()

    return {
        "message": "Check-out thành công",
        "so_gio_lam": so_gio_lam,
        "so_gio_tang_ca": so_gio_tang_ca
    }
       

def get_cham_cong(db: Session, ma_nv: str, thang: int, nam: int):
    rows = db.execute(
        text("""
            SELECT 
                ngay,
                TIME_FORMAT(gio_vao, '%H:%i:%s') AS gio_vao,
                TIME_FORMAT(gio_ra,  '%H:%i:%s') AS gio_ra,
                so_gio_lam,
                trang_thai,
                so_gio_tang_ca,
                so_lan_di_muon_ve_som
            FROM cham_cong
            WHERE ma_nhan_vien = :ma
              AND MONTH(ngay) = :thang
              AND YEAR(ngay) = :nam
            ORDER BY ngay
        """),
        {
            "ma": ma_nv,
            "thang": thang,
            "nam": nam
        }
    ).fetchall()

    # ✅ KHÔNG CÓ DỮ LIỆU
    if not rows:
        return {
            "message": "Chưa có dữ liệu chấm công cho tháng này",
            "data": []
        }

    result = []
    for r in rows:
        result.append({
            "ngay": r.ngay,
            "gio_vao": r.gio_vao,
            "gio_ra": r.gio_ra,
            "so_gio_lam": r.so_gio_lam,
            "trang_thai": r.trang_thai,
            "so_gio_tang_ca": r.so_gio_tang_ca,
            "so_lan_di_muon_ve_som": r.so_lan_di_muon_ve_som
        })

    return {
        "message": "Lấy dữ liệu chấm công thành công",
        "data": result
    }
