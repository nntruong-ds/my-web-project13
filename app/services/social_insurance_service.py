from sqlalchemy.orm import Session
from sqlalchemy import or_, extract
from datetime import date
import pandas as pd
from io import BytesIO

from app.models.social_insurance import SocialInsurance
from app.models.employee import Employee
from app.models.department import Department
from app.schemas.social_insurance_schema import SocialInsuranceCreate, SocialInsuranceUpdate

class SocialInsuranceService:

    # Tìm kiếm nâng cao (Search & Filter)
    @staticmethod
    def search_insurance(
        db: Session, 
        keyword: str = None, 
        thang: int = None, 
        nam: int = None,
        mapb: str = None,
        macn: int = None
    ):
        query = db.query(SocialInsurance)

        # Dùng outerjoin để KHÔNG MẤT dữ liệu nếu nhân viên bị null/lỗi
        query = query.outerjoin(SocialInsurance.nhan_vien)
        query = query.outerjoin(Employee.phong_truc_thuoc)
        query = query.outerjoin(Employee.chi_nhanh_lam_viec)

        # Bộ lọc chính xác
        if thang:
            query = query.filter(SocialInsurance.thang == thang) # Lọc theo cột 'thang' (int)
        if nam:
            # Lọc theo năm của cột 'thang_nam' (date)
            query = query.filter(extract('year', SocialInsurance.thang_nam) == nam)
        if mapb:
            query = query.filter(Employee.phong_ban_id == mapb)
        if macn:
            query = query.filter(Employee.chinhanh_id == macn)
        
        # Bộ lọc từ khóa (Tìm đa năng)
        if keyword:
            search_key = f"%{keyword}%"
            query = query.filter(
                or_(
                    Employee.ma_nhan_vien.ilike(search_key), # Tìm theo mã NV
                    Employee.ho_ten.ilike(search_key),       # Tìm theo tên NV
                )
            )
            
        return query.order_by(SocialInsurance.thang_nam.desc()).all()

    # Thêm mới
    @staticmethod
    def create(db: Session, data: SocialInsuranceCreate):
        # Check trùng khóa chính (NV + Sổ + Tháng/Năm)
        exists = db.query(SocialInsurance).filter(
            SocialInsurance.ma_nhan_vien == data.ma_nhan_vien,
            SocialInsurance.so_so_bhxh == data.so_so_bhxh,
            SocialInsurance.thang_nam == data.thang_nam,
            SocialInsurance.thang == data.thang
        ).first()
        
        if exists:
            raise ValueError("Dữ liệu BHXH tháng này của nhân viên đã tồn tại!")

        new_record = SocialInsurance(**data.model_dump())
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return new_record

    # Cập nhật
    @staticmethod
    def update(
        db: Session,
        data: SocialInsuranceUpdate
    ):
        record = db.query(SocialInsurance).filter(
            SocialInsurance.ma_nhan_vien == data.ma_nhan_vien,
            SocialInsurance.so_so_bhxh == data.so_so_bhxh,
            SocialInsurance.thang_nam == data.thang_nam,
            SocialInsurance.thang == data.thang
        ).first()
        
        if not record:
            raise ValueError("Không tìm thấy bản ghi BHXH này!")
            
        record.trang_thai = data.trang_thai
        record.thang = data.thang # Cho phép sửa lại tháng nếu nhập sai
        
        db.commit()
        db.refresh(record)
        return record
    
    @staticmethod
    def export_to_excel(
        db: Session, 
        keyword: str = None, 
        thang: int = None, 
        nam: int = None,
        mapb: str = None,
        macn: int = None,
    ):
        # TÁI SỬ DỤNG hàm search để lấy dữ liệu đúng theo bộ lọc
        records = SocialInsuranceService.search_insurance(db, keyword, thang, nam, mapb, macn)

        # Chuẩn bị dữ liệu (List of Dictionaries)
        data_list = []
        for record in records:
            data_list.append({
                "Mã Nhân Viên": record.ma_nhan_vien,
                # Dùng property đã định nghĩa trong Model (tự xử lý null)
                "Họ và Tên": record.ten_nhan_vien or "", 
                "Mã BHXH": record.so_so_bhxh,
                "Chi Nhánh": record.ten_chi_nhanh or "",
                "Phòng Ban": record.ten_phong_ban or ""
            })

        # Tạo DataFrame bằng Pandas
        df = pd.DataFrame(data_list)

        # Ghi vào bộ nhớ đệm (RAM)
        output = BytesIO()
        
        # Dùng ExcelWriter với engine openpyxl
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            sheet_name = 'Danh sách BHXH'
            df.to_excel(writer, index=False, sheet_name=sheet_name)
            
            # (Optional) Format độ rộng cột cho đẹp
            worksheet = writer.sheets[sheet_name]
            for column_cells in worksheet.columns:
                length = max(len(str(cell.value)) for cell in column_cells)
                # Giới hạn độ rộng tối đa là 50 cho đỡ bị quá khổ
                worksheet.column_dimensions[column_cells[0].column_letter].width = min(length + 2, 50)

        output.seek(0) # Đưa con trỏ về đầu file
        return output