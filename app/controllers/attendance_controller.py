from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import date

from app.services.attendance_service import AttendanceService
from app.schemas.attendance_schema import *

class AttendanceController:
    
    @staticmethod
    def check_in(db: Session, request: CheckInRequest):
        try:
            # Service chỉ cần chuỗi mã nhân viên
            # Controller chịu trách nhiệm bóc tách từ Schema ra
            return AttendanceService.check_in(db, request.ma_nhan_vien)
        except ValueError as e:
            # Chuyển lỗi logic (đã check-in rồi, không tồn tại...) thành lỗi HTTP 400
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def check_out(db: Session, request: CheckOutRequest):
        try:
            return AttendanceService.check_out(db, request.ma_nhan_vien)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_history(db: Session, ma_nhan_vien: str = None, thang: int = None, nam: int = None):
        return AttendanceService.get_history(db, ma_nhan_vien, thang, nam)

    # Hàm sửa công dành cho Admin
    @staticmethod
    def admin_update(db: Session, request: AttendanceUpdate):
        try:
            return AttendanceService.admin_update_attendance(db, request)
        except Exception as e:
            # Lỗi DB hoặc logic lạ
            raise HTTPException(status_code=400, detail=f"Lỗi cập nhật công: {str(e)}")
        
    # Hàm xóa lịch sử chấm công
    @staticmethod
    def delete_attendance(db: Session, ma_nhan_vien: str, ngay: date):
        try:
            return AttendanceService.delete_attendance(db, ma_nhan_vien, ngay)
        except ValueError as e:
            # Lỗi không tìm thấy -> Trả về 404 Not Found
            raise HTTPException(status_code=404, detail=str(e))
        except Exception as e:
            # Lỗi khác -> 400
            raise HTTPException(status_code=400, detail=str(e))