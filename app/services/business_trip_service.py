from sqlalchemy.orm import Session
from sqlalchemy import or_, extract
from datetime import date
import pandas as pd
from io import BytesIO

from app.models.business_trip import BusinessTrip
from app.schemas.business_trip_schema import *
from app.models.employee import Employee
from app.models.department import Department
from app.models.position import Position

class BusinessTripService:
    
    # Lấy danh sách công tác của nhân viên
    @staticmethod
    def get_trips_by_employee(db: Session, ma_nhan_vien: str):
        return (db.query(BusinessTrip)
            .filter(BusinessTrip.ma_nhan_vien == ma_nhan_vien)
            .order_by(BusinessTrip.tu_ngay.desc())
            .all())

    # Đăng ký đi công tác mới
    @staticmethod
    def create_trip(db: Session, data: BusinessTripCreate):
        # Kiểm tra xem đã tồn tại chuyến đi trùng (Mã NV, PB, CV, Ngày bắt đầu) chưa
        existing_trip = db.query(BusinessTrip).filter(
            BusinessTrip.ma_nhan_vien == data.ma_nhan_vien,
            BusinessTrip.phong_ban_id == data.phong_ban_id,
            BusinessTrip.chuc_vu_id == data.chuc_vu_id,
            BusinessTrip.tu_ngay == data.tu_ngay
        ).first()
        
        if existing_trip:
            raise ValueError("Đã tồn tại hồ sơ công tác bắt đầu vào ngày này với chức vụ/phòng ban này!")

        new_trip = BusinessTrip(
            ma_nhan_vien=data.ma_nhan_vien,
            phong_ban_id=data.phong_ban_id,
            chuc_vu_id=data.chuc_vu_id,
            tu_ngay=data.tu_ngay,
            den_ngay=data.den_ngay,
            chi_nhanh=data.chi_nhanh,
            dia_diem=data.dia_diem,
            thang=data.thang
        )
        db.add(new_trip)
        db.commit()
        db.refresh(new_trip)
        return new_trip

    # Cập nhật thông tin chuyến đi
    # Cần truyền đủ 4 tham số khóa chính để tìm ra bản ghi
    @staticmethod
    def update_trip(
        db: Session, 
        ma_nv: str, pb_id: str, cv_id: str, tu_ngay: date, 
        data: BusinessTripUpdate
    ):
        trip = db.query(BusinessTrip).filter(
            BusinessTrip.ma_nhan_vien == ma_nv,
            BusinessTrip.phong_ban_id == pb_id,
            BusinessTrip.chuc_vu_id == cv_id,
            BusinessTrip.tu_ngay == tu_ngay
        ).first()
        
        if not trip:
            raise ValueError("Không tìm thấy chuyến công tác này!")

        # Cập nhật các trường cho phép
        if data.den_ngay is not None: trip.den_ngay = data.den_ngay
        if data.chi_nhanh is not None: trip.chi_nhanh = data.chi_nhanh
        if data.dia_diem is not None: trip.dia_diem = data.dia_diem
        if data.thang is not None: trip.thang = data.thang
        
        db.commit()
        db.refresh(trip)
        return trip
    
    # Hàm tìm kiếm nâng cao
    @staticmethod
    def search_trips(
        db: Session, 
        keyword: str = None,   # Tìm theo tên hoặc mã NV
        thang: int = None,     # Lọc theo tháng
        nam: int = None,       # Lọc theo năm
        phong_ban_id: str = None,
        chi_nhanh: str = None
    ):
        # Bắt đầu Query
        query = db.query(BusinessTrip)

        # Join các bảng để lấy tên (Mặc dù lazy='joined' đã làm, nhưng khai báo rõ ràng để filter)
        query = query.outerjoin(BusinessTrip.nhan_vien)\
                     .outerjoin(BusinessTrip.phong_ban)\
                     .outerjoin(BusinessTrip.chuc_vu)

        # Áp dụng từng bộ lọc nếu có
        
        # Lọc theo Tháng/Năm (Dựa trên cột tu_ngay)
        if thang:
            query = query.filter(extract('month', BusinessTrip.tu_ngay) == thang)
        if nam:
            query = query.filter(extract('year', BusinessTrip.tu_ngay) == nam)

        # Lọc theo Phòng ban
        if phong_ban_id:
            query = query.filter(BusinessTrip.phong_ban_id == phong_ban_id)

        # Lọc theo Chi nhánh (Tìm gần đúng)
        if chi_nhanh:
            query = query.filter(BusinessTrip.chi_nhanh.ilike(f"%{chi_nhanh}%"))

        # Lọc theo Từ khóa (Tên NV hoặc Mã NV)
        if keyword:
            search_key = f"%{keyword}%"
            query = query.filter(
                or_(
                    Employee.ma_nhan_vien.ilike(search_key),
                    Employee.ho_ten.ilike(search_key)
                )
            )

        # Sắp xếp: Mới nhất lên đầu
        return query.order_by(BusinessTrip.tu_ngay.desc()).all()
    
    @staticmethod
    def export_to_excel(
        db: Session, 
        keyword: str = None, 
        thang: int = None, 
        nam: int = None, 
        phong_ban_id: str = None, 
        chi_nhanh: str = None
    ):

        trips = BusinessTripService.search_trips(
            db, keyword, thang, nam, phong_ban_id, chi_nhanh
        )

        # Chuẩn bị dữ liệu để đưa vào Excel
        data_list = []
        for trip in trips:
            data_list.append({
                "Mã NV": trip.ma_nhan_vien,
                "Họ và tên": trip.nhan_vien.ho_ten or "",
                "Phòng ban": trip.phong_ban.ten_phong or "",
                "Chức vụ": trip.chuc_vu.ten_chuc_vu or "",
                "Chi nhánh": trip.chi_nhanh,
                "Địa điểm": trip.dia_diem,
                "Từ ngày": trip.tu_ngay,
                "Đến ngày": trip.den_ngay,
                "Tháng bắt đầu": trip.thang
            })

        # Tạo DataFrame (Bảng dữ liệu) bằng Pandas
        df = pd.DataFrame(data_list)

        # Ghi vào bộ nhớ đệm (RAM) thay vì lưu ra file cứng
        output = BytesIO()
        
        # Dùng ExcelWriter để format đẹp hơn (nếu cần)
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Danh sách công tác')
            
            # (Tùy chọn) Auto-adjust column width - Tự động giãn cột cho đẹp
            worksheet = writer.sheets['Danh sách công tác']
            for column_cells in worksheet.columns:
                length = max(len(str(cell.value)) for cell in column_cells)
                worksheet.column_dimensions[column_cells[0].column_letter].width = length + 2

        output.seek(0) # Đưa con trỏ về đầu file để sẵn sàng đọc
        return output