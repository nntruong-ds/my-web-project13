from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import date

from app.services.business_trip_service import BusinessTripService
from app.schemas.business_trip_schema import BusinessTripCreate, BusinessTripUpdate

class BusinessTripController:
    @staticmethod
    def search_trips(
        db: Session, 
        keyword: str, thang: int, nam: int, 
        phong_ban_id: str, chi_nhanh: str
    ):
       return BusinessTripService.search_trips(db, keyword, thang, nam, phong_ban_id, chi_nhanh)
    
    @staticmethod
    def get_employee_trips(db: Session, ma_nhan_vien: str):
        # Chỉ đơn giản là gọi Service lấy dữ liệu
        return BusinessTripService.get_trips_by_employee(db, ma_nhan_vien)

    @staticmethod
    def create_trip(db: Session, request: BusinessTripCreate):
        try:
            return BusinessTripService.create_trip(db, request)
        except ValueError as e:
            # Bắt lỗi ValueError từ Service (ví dụ: trùng lịch) -> Trả về 400 Bad Request
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            # Các lỗi không xác định khác
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    def update_trip(
        db: Session, 
        ma_nv: str, pb_id: str, cv_id: str, tu_ngay: date, 
        request: BusinessTripUpdate
    ):
        try:
            return BusinessTripService.update_trip(db, ma_nv, pb_id, cv_id, tu_ngay, request)
        except ValueError as e:
            # Lỗi không tìm thấy chuyến đi -> Trả về 404 Not Found
            raise HTTPException(status_code=404, detail=str(e))
        
    @staticmethod
    def export_excel(
        db: Session, 
        keyword: str, thang: int, nam: int, 
        phong_ban_id: str, chi_nhanh: str
    ):
        return BusinessTripService.export_to_excel(
            db, keyword, thang, nam, phong_ban_id, chi_nhanh
        )