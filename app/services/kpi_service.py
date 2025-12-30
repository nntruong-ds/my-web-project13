from sqlalchemy.orm import Session, contains_eager
from sqlalchemy import or_, extract, func
from itertools import groupby
import pandas as pd
from io import BytesIO

from app.models.kpi import EmployeeKPI, TrangThaiKPI
from app.models.employee import Employee
from app.schemas.kpi_schema import KPICreate, KPIUpdate, KPIOverviewResponse

class KPIService:

    # API cho màn hình 1
    # Gom nhóm theo nhân viên và tính trung bình
    @staticmethod
    def get_overview(db: Session, thang: int, nam: int, mapb: str = None, macn: int = None, keyword: str = None):
        # Lấy tất cả KPI trong tháng đó
        query = db.query(EmployeeKPI)\
          .join(EmployeeKPI.nhan_vien)\
          .options(contains_eager(EmployeeKPI.nhan_vien))\
          .outerjoin(Employee.phong_truc_thuoc)\
          .outerjoin(Employee.chi_nhanh_lam_viec)

        # Filter cơ bản
        if thang: query = query.filter(EmployeeKPI.thang == thang)
        if nam: query = query.filter(EmployeeKPI.nam == nam)
        if mapb: query = query.filter(Employee.phong_ban_id == mapb)
        if macn: query = query.filter(Employee.chinhanh_id == macn)
        
        if keyword:
            key = f"%{keyword}%"
            query = query.filter(or_(Employee.ma_nhan_vien.ilike(key), Employee.ho_ten.ilike(key)))

        # Sắp xếp theo Mã NV để phục vụ cho việc Group By
        records = query.order_by(EmployeeKPI.ma_nhan_vien).all()

        results = []
        # Dùng itertools.groupby để gom nhóm KPI theo nhân viên
        for ma_nv, group in groupby(records, key=lambda x: x.ma_nhan_vien):
            kpi_list = list(group)
            first_record = kpi_list[0] # Lấy thông tin nhân viên từ bản ghi đầu tiên

            # Tính toán tổng hợp
            total_score = sum(k.ty_le_hoan_thanh or 0 for k in kpi_list)
            count = len(kpi_list)
            avg_score = total_score / count if count > 0 else 0

            # Logic đánh giá chung
            status_text = "ĐẠT" if avg_score >= 80 else "KHÔNG ĐẠT"

            results.append(KPIOverviewResponse(
                ma_nhan_vien=ma_nv,
                ten_nhan_vien=first_record.ten_nhan_vien or "",
                ten_phong_ban=first_record.ten_phong_ban,
                ten_chi_nhanh=first_record.ten_chi_nhanh,
                kpi_trung_binh=round(avg_score, 2),
                danh_gia_chung=status_text,
                so_luong_tieu_chi=count
            ))
        
        return results
    
    @staticmethod
    def export_overview_excel(db: Session, thang: int, nam: int, mapb: str = None, macn: int = None, keyword: str = None):
        overview_data = KPIService.get_overview(db, thang, nam, mapb, macn, keyword)

        # Chuyển đổi list Pydantic object thành list Dictionary cho Pandas
        data_list = []
        for item in overview_data:
            data_list.append({
                "Mã Nhân Viên": item.ma_nhan_vien,
                "Họ và Tên": item.ten_nhan_vien,
                "Phòng Ban": item.ten_phong_ban or "",
                "Chi Nhánh": item.ten_chi_nhanh or "",
                "KPI Trung Bình (%)": round(item.kpi_trung_binh, 2),
                "Đánh Giá Chung": item.danh_gia_chung
            })

        # Tạo DataFrame và ghi vào Excel
        df = pd.DataFrame(data_list)
        output = BytesIO()
        
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            sheet_name = f'KPI_Thang{thang}_{nam}'
            df.to_excel(writer, index=False, sheet_name=sheet_name)
            
            # Format độ rộng cột cho đẹp
            worksheet = writer.sheets[sheet_name]
            for column_cells in worksheet.columns:
                length = max(len(str(cell.value)) for cell in column_cells)
                worksheet.column_dimensions[column_cells[0].column_letter].width = min(length + 2, 50)

        output.seek(0)
        return output

    # API cho màn hình 2
    @staticmethod
    def get_details(db: Session, ma_nv: str, thang: int, nam: int):
        return db.query(EmployeeKPI).filter(
            EmployeeKPI.ma_nhan_vien == ma_nv,
            EmployeeKPI.thang == thang,
            EmployeeKPI.nam == nam
        ).all()

    # Thêm KPI
    @staticmethod
    def create(db: Session, data: KPICreate):
        # Check trùng (Mã NV + Tên KPI + Kỳ)
        exists = db.query(EmployeeKPI).filter(
            EmployeeKPI.ma_nhan_vien == data.ma_nhan_vien,
            EmployeeKPI.ten_kpi == data.ten_kpi,
            EmployeeKPI.ky_danh_gia == data.ky_danh_gia
        ).first()
        
        if exists:
            raise ValueError(f"KPI '{data.ten_kpi}' đã tồn tại trong kỳ này!")

        new_kpi = EmployeeKPI(**data.model_dump())
        db.add(new_kpi)
        db.commit()
        db.refresh(new_kpi)
        return new_kpi

    # Cập nhật KPI
    @staticmethod
    def update(db: Session, ma_nv: str, ten_kpi: str, ky_danh_gia: str, data: KPIUpdate):
        kpi = db.query(EmployeeKPI).filter(
            EmployeeKPI.ma_nhan_vien == ma_nv,
            EmployeeKPI.ten_kpi == ten_kpi,
            EmployeeKPI.ky_danh_gia == ky_danh_gia
        ).first()
        
        if not kpi:
            raise ValueError("Không tìm thấy chỉ tiêu KPI này!")
            
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(kpi, key, value)
            
        db.commit()
        db.refresh(kpi)
        return kpi