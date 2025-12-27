from sqlalchemy.orm import Session
from sqlalchemy import or_, extract
import pandas as pd
from io import BytesIO

from app.models.health_insurance import HealthInsurance
from app.models.employee import Employee
from app.schemas.health_insurance_schema import HealthInsuranceCreate, HealthInsuranceUpdate

class HealthInsuranceService:

    # Tìm kiếm & Lọc
    @staticmethod
    def search_insurance(
        db: Session, 
        keyword: str = None, 
        thang: int = None, 
        nam: int = None,
        mapb: str = None,
        macn: int = None
    ):
        query = db.query(HealthInsurance)

        # Join: BHYT -> NV -> Phòng & Chi nhánh
        query = query.outerjoin(HealthInsurance.nhan_vien)\
                     .outerjoin(Employee.phong_truc_thuoc)\
                     .outerjoin(Employee.chi_nhanh_lam_viec)

        # Bộ lọc
        if thang: query = query.filter(HealthInsurance.thang == thang)
        if nam: query = query.filter(extract('year', HealthInsurance.thang_nam) == nam)
        if mapb: query = query.filter(Employee.phong_ban_id == mapb)
        if macn: query = query.filter(Employee.chinhanh_id == macn)
        
        # Tìm kiếm đa năng (Mã NV, Tên NV)
        if keyword:
            search_key = f"%{keyword}%"
            query = query.filter(
                or_(
                    Employee.ma_nhan_vien.ilike(search_key),
                    Employee.ho_ten.ilike(search_key),
                )
            )
            
        return query.order_by(HealthInsurance.thang_nam.desc()).all()

    # Thêm mới
    @staticmethod
    def create(db: Session, data: HealthInsuranceCreate):
        exists = db.query(HealthInsurance).filter(
            HealthInsurance.ma_nhan_vien == data.ma_nhan_vien,
            HealthInsurance.so_the_bhyt == data.so_the_bhyt,
            HealthInsurance.thang_nam == data.thang_nam,
            HealthInsurance.thang == data.thang
        ).first()
        
        if exists:
            raise ValueError("Dữ liệu BHYT này đã tồn tại!")

        new_record = HealthInsurance(**data.model_dump())
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return new_record

    # Cập nhật
    @staticmethod
    def update(db: Session, data: HealthInsuranceUpdate):
        record = db.query(HealthInsurance).filter(
            HealthInsurance.ma_nhan_vien == data.ma_nhan_vien,
            HealthInsurance.so_the_bhyt == data.so_the_bhyt,
            HealthInsurance.thang_nam == data.thang_nam
        ).first()
        
        if not record:
            raise ValueError("Không tìm thấy bản ghi BHYT!")
            
        record.trang_thai = data.trang_thai
        record.thang = data.thang # Cho phép sửa lại tháng nếu nhập sai
        
        db.commit()
        db.refresh(record)
        return record
    
    # Xuất Excel
    @staticmethod
    def export_to_excel(db: Session, keyword, thang, nam, mapb, macn):
        records = HealthInsuranceService.search_insurance(db, keyword, thang, nam, mapb, macn)

        data_list = []
        for record in records:
            data_list.append({
                "Mã NV": record.ma_nhan_vien,
                "Họ Tên": record.ten_nhan_vien or "", 
                "Số Thẻ BHYT": record.so_the_bhyt,
                "Chi Nhánh": record.ten_chi_nhanh or "",
                "Phòng Ban": record.ten_phong_ban or "",
            })

        df = pd.DataFrame(data_list)
        output = BytesIO()
        
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            sheet_name = 'BHYT'
            df.to_excel(writer, index=False, sheet_name=sheet_name)
            worksheet = writer.sheets[sheet_name]
            for column_cells in worksheet.columns:
                length = max(len(str(cell.value)) for cell in column_cells)
                worksheet.column_dimensions[column_cells[0].column_letter].width = min(length + 2, 50)

        output.seek(0)
        return output