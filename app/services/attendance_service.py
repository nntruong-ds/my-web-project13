from sqlalchemy.orm import Session
from sqlalchemy import extract, and_
from datetime import datetime, date, time, timedelta
from decimal import Decimal

from app.models.enums import TrangThaiChamCong
from app.models.attendance import Attendance
from app.models.employee import Employee
from app.schemas.attendance_schema import *

class AttendanceService:
    
    # Cấu hình thời gian
    START_TIME = time(8, 0, 0)   # 08:00:00
    END_TIME = time(17, 0, 0)   # 17:00:00
    START_BREAK = time(12, 0, 0)    # 12:00:00
    END_BREAK = time(13, 0, 0) # 13:00:00

    @staticmethod
    def check_in(db: Session, manv: str):
        """
        Logic: Chỉ ghi nhận giờ vào, chưa tính toán gì cả.
        """
        today = date.today()
        now_time = datetime.now().time()

        # Kiểm tra nhân viên tồn tại (Optional - vì FK đã chặn rồi, nhưng check ở đây để báo lỗi đẹp hơn)
        employee = db.query(Employee).filter(Employee.ma_nhan_vien == manv).first()
        if not employee:
            raise ValueError(f"Nhân viên {manv} không tồn tại!")

        # Kiểm tra xem hôm nay đã check-in chưa
        existing_attendance = db.query(Attendance).filter(
            Attendance.ma_nhan_vien == manv,
            Attendance.ngay == today
        ).first()

        if existing_attendance:
            raise ValueError("Hôm nay bạn đã thực hiện Check-in rồi!")

        # Tạo record mới
        new_attendance = Attendance(
            ma_nhan_vien=manv,
            ngay=today,
            gio_vao=now_time,
            trang_thai=TrangThaiChamCong.DI_LAM,
            so_gio_lam=0,
            so_gio_tang_ca=0,
            so_lan_di_muon_ve_som=0,
            so_ngay_da_nghi_phep=0
        )

        db.add(new_attendance)
        db.commit()
        db.refresh(new_attendance)
        
        return new_attendance

    @staticmethod
    def check_out(db: Session, manv: str):
        today = date.today()

        # Tìm record check-in sáng nay
        attendance = db.query(Attendance).filter(
            Attendance.ma_nhan_vien == manv,
            Attendance.ngay == today
        ).first()

        # Lỗi chưa check-in
        if not attendance:
            raise ValueError("Bạn chưa Check-in, không thể Check-out!")
        
        if attendance.gio_ra is not None:
            raise ValueError("Bạn đã Check-out rồi, không thể thực hiện lại!")

        # Lấy cả ngày và giờ để tính toán
        attendance.gio_ra = datetime.now().time()
        
        # Gọi hàm tính toán
        result = AttendanceService.calculate_attendance(attendance.gio_vao, attendance.gio_ra)
        
        # Gán giá trị
        attendance.so_gio_lam = result["so_gio_lam"]
        attendance.so_gio_tang_ca = result["so_gio_tang_ca"]
        attendance.so_lan_di_muon_ve_som = result["so_lan_di_muon_ve_som"]
        attendance.so_ngay_da_nghi_phep = result["so_ngay_da_nghi_phep"]
        attendance.trang_thai = result["trang_thai"]

        db.commit()
        db.refresh(attendance)
        return attendance
    
    # Hàm tính toán các thuộc tính
    @staticmethod
    def calculate_attendance(gio_vao: time, gio_ra: time):
        """
        Hàm thuần túy tính toán: Nhận vào 2 mốc thời gian -> Trả về dictionary các chỉ số
        """
        if not gio_vao or not gio_ra:
            return {}

        dummy_date = date(2000, 1, 1)
        dt_checkin = datetime.combine(dummy_date, gio_vao)
        dt_checkout = datetime.combine(dummy_date, gio_ra)
        
        # Mốc chuẩn
        dt_start_time = datetime.combine(dummy_date, AttendanceService.START_TIME) # 08:00
        dt_end_time = datetime.combine(dummy_date, AttendanceService.END_TIME)   # 17:00
        dt_start_break = datetime.combine(dummy_date, AttendanceService.START_BREAK)   # 12:00
        dt_end_break = datetime.combine(dummy_date, AttendanceService.END_BREAK)   # 13:00

        # --- TÍNH SỐ GIỜ LÀM (Working Hours) ---
        # Logic: Chỉ tính thời gian nằm trong khung 08:00 -> 17:00
        # Nếu vào sớm hơn 08:00 -> Lấy 08:00
        # Nếu về muộn hơn 17:00 -> Lấy 17:00 (phần dư tính sang OT)
        
        effective_start = max(dt_checkin, dt_start_time) # Vào sớm hơn 08:00 vẫn tính từ 08:00
        effective_end = min(dt_checkout, dt_end_time)     # Về muộn hơn 17:00 vẫn tính đến 17:00
        
        # Nếu vào sau giờ về (ví dụ vào 18:00) -> Nhân viên hôm đấy chỉ tăng ca không làm giờ hành chính
        if effective_start >= effective_end:
            time_work = 0
        else:
            time_work = (effective_end - effective_start).total_seconds() / 3600

        # TÍNH THỜI GIAN "LỌT" VÀO GIỜ NGHỈ TRƯA (Deduction)
        # Tìm khoảng giao nhau giữa [Giờ làm] và [12:00 - 13:00]
        overlap_start = max(effective_start, dt_start_break) # Max(Giờ vào, 12:00)
        overlap_end = min(effective_end, dt_end_break)       # Min(Giờ ra, 13:00)

        deduction_time = 0
        if overlap_start < overlap_end:
            deduction_time = (overlap_end - overlap_start).total_seconds()

        # Giờ làm thực tế = Tổng thời gian tính toán - Thời gian nghỉ trưa
        time_work = round(max(0, (time_work - deduction_time) / 3600), 2)   # Làm tròn 2 chữ số và đảm bảo không âm

        # Tính giờ tăng ca
        # Chỉ tính nếu Giờ ra thực tế > 17:00
        ot_seconds = (dt_checkout - dt_end_time).total_seconds()
        ot_time = round(max(0, ot_seconds / 3600), 2)

        # Tính lỗi vi phạm
        violation_count = 0
        if gio_vao > AttendanceService.START_TIME:
            violation_count += 1
        if gio_ra < AttendanceService.END_TIME:
            violation_count += 1

        # Xác định trạng thái
        trang_thai = TrangThaiChamCong.DI_LAM
        if ot_time > 0:
            trang_thai = TrangThaiChamCong.LAM_THEM
        
        return {
            "so_gio_lam": time_work + ot_time,
            "so_gio_tang_ca": ot_time,
            "so_lan_di_muon_ve_som": violation_count,
            "trang_thai": trang_thai
        }

    # Xem lịch sử chấm công
    @staticmethod
    def get_history(db: Session, ma_nhan_vien: str = None, thang: int = None, nam: int = None):
        """
        Lấy lịch sử chấm công, hỗ trợ lọc theo tháng/năm
        """
        # Query cơ bản
        query = db.query(Attendance)
        
        # Nếu có mã nhân viên -> lọc
        if ma_nhan_vien:
            query = query.filter(Attendance.ma_nhan_vien == ma_nhan_vien)
        
        # Xử lý lọc theo Thời gian
        # CHỈ LỌC KHI CÓ THAM SỐ TRUYỀN VÀO
        if thang:
            query = query.filter(extract('month', Attendance.ngay) == thang)
        
        if nam:
            query = query.filter(extract('year', Attendance.ngay) == nam)

        # Sắp xếp ngày tăng dần
        query = query.order_by(Attendance.ngay.asc())
        
        return query.all()
    
    # Chỉnh sửa bảng chấm công (chỉ Admin có quyền)
    @staticmethod
    def admin_update_attendance(db: Session, data: AttendanceUpdate):
        # Tìm bản ghi cũ
        attendance = db.query(Attendance).filter(
            Attendance.ma_nhan_vien == data.ma_nhan_vien,
            Attendance.ngay == data.ngay
        ).first()

        # Tạo mới nếu chưa có (trường hợp nhân viên quên chấm công)
        if not attendance:
            attendance = Attendance(ma_nhan_vien=data.ma_nhan_vien, ngay=data.ngay)
            db.add(attendance)
        
        # Cập nhật Giờ vào/Giờ ra nếu Admin có gửi
        if data.gio_vao is not None: attendance.gio_vao = data.gio_vao
        if data.gio_ra is not None: attendance.gio_ra = data.gio_ra

        # LOGIC TỰ ĐỘNG TÍNH LẠI
        # Nếu đã có đủ cả giờ vào và giờ ra -> Hệ thống tự tính lại các chỉ số
        if attendance.gio_vao and attendance.gio_ra:
            result = AttendanceService.calculate_attendance(attendance.gio_vao, attendance.gio_ra)
            
            # Gán kết quả máy tính vào
            attendance.so_gio_lam = result.get("so_gio_lam")
            attendance.so_gio_tang_ca = result.get("so_gio_tang_ca")
            attendance.so_lan_di_muon_ve_som = result.get("so_lan_di_muon_ve_som")
            attendance.trang_thai = result.get("trang_thai")

        # LOGIC GHI ĐÈ THỦ CÔNG
        # Nếu Admin muốn tự gửi các chỉ số này -> Ưu tiên lấy của Admin (ghi đè lên máy tính)
        if data.so_gio_lam is not None: attendance.so_gio_lam = data.so_gio_lam
        if data.so_gio_tang_ca is not None: attendance.so_gio_tang_ca = data.so_gio_tang_ca
        if data.so_lan_di_muon_ve_som is not None: attendance.so_lan_di_muon_ve_som = data.so_lan_di_muon_ve_som
        if data.trang_thai is not None: attendance.trang_thai = data.trang_thai

        db.commit()
        db.refresh(attendance)
        return attendance
    
    # Xóa lịch sử chấm công
    @staticmethod
    def delete_attendance(db: Session, ma_nhan_vien: str, ngay: date):
        # Tìm bản ghi cần xóa
        attendance = db.query(Attendance).filter(
            Attendance.ma_nhan_vien == ma_nhan_vien,
            Attendance.ngay == ngay
        ).first()

        # Không tìm thấy dữ liệu
        if not attendance:
            raise ValueError(f"Không tìm thấy dữ liệu chấm công của {ma_nhan_vien} ngày {ngay}!")

        # Thực hiện xóa
        db.delete(attendance)
        db.commit()
        
        return {"message": "Đã xóa thành công!"}