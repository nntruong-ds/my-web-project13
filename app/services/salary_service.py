from sqlalchemy.orm import Session, contains_eager
from sqlalchemy import or_, func, extract
import pandas as pd
from io import BytesIO

from app.models.salary import Salary
from app.models.employee import Employee
from app.models.attendance import Attendance
from app.schemas.salary_schema import SalaryRequest

class SalaryService:
    # Hàm hỗ trợ lấy thông tin OT (Dùng chung cho cả tính toán và hiển thị)
    @staticmethod
    def get_ot(db: Session, ma_nv: str, thang: int, nam: int):
        # Lấy tổng giờ tăng ca từ bảng Chấm công
        total_ot = db.query(func.sum(Attendance.so_gio_tang_ca)).filter(
            Attendance.ma_nhan_vien == ma_nv,
            extract('month', Attendance.ngay) == thang,
            extract('year', Attendance.ngay) == nam
        ).scalar() or 0
        return float(total_ot)

    # Tính toán và lưu lương
    @staticmethod
    def calculate_and_save(db: Session, data: SalaryRequest):
        # Lấy giờ OT & Tính tiền OT
        ot_hours = SalaryService.get_ot(db, data.ma_nhan_vien, data.thang, data.nam)

        # Tính tiền tăng ca
        # Logic: (Lương CB / 26 / 8) * Giờ OT * hệ số lương
        basic_hourly_wage = float(data.luong_co_ban) / 26 / 8 
        tien_tang_ca = ot_hours * basic_hourly_wage * data.he_so_luong

        # Tính toán các khoản khác
        # Tổng Thu nhập = (Lương CB * Hệ số lương) + Phụ cấp + Thưởng + Tiền Tăng ca
        income = (data.luong_co_ban * data.he_so_luong) + data.phu_cap + data.thuong + tien_tang_ca
        
        # Tổng Khấu trừ
        deductions = data.bhyt + data.bhxh + data.phat
        
        # Thực nhận = Thu nhập - Khấu trừ + Nợ tháng trước
        net_salary = income - deductions + data.luong_no_thang_truoc

        # Lưu vào database
        salary_record = db.query(Salary).filter(
            Salary.ma_nhan_vien == data.ma_nhan_vien,
            Salary.thang == data.thang,
            Salary.nam == data.nam
        ).first()

        if not salary_record:
            salary_record = Salary(**data.model_dump())
        else:
            update_data = data.model_dump()
            for key, value in update_data.items():
                setattr(salary_record, key, value)
        
        # Cập nhật các giá trị tính toán
        salary_record.tong_luong = round(net_salary, 2)

        db.add(salary_record)
        db.commit()
        db.refresh(salary_record)

        salary_record.so_gio_tang_ca = ot_hours
        salary_record.tien_tang_ca = round(tien_tang_ca, 2)
        
        return salary_record

    # Lấy danh sách lương
    @staticmethod
    def get_salaries(db: Session, thang: int, nam: int, mapb: str = None, macn: int = None, macv: str = None, keyword: str = None):
        query = db.query(Salary).join(Salary.nhan_vien)\
                  .options(contains_eager(Salary.nhan_vien))\
                  .outerjoin(Employee.phong_truc_thuoc)\
                  .outerjoin(Employee.chi_nhanh_lam_viec)\
                  .outerjoin(Employee.chuc_vu)

        if thang: query = query.filter(Salary.thang == thang)
        if nam: query = query.filter(Salary.nam == nam)
        if mapb: query = query.filter(Employee.phong_ban_id == mapb)
        if macn: query = query.filter(Employee.chinhanh_id == macn)
        if macv: query = query.filter(Employee.chuc_vu_id == macv)

        if keyword:
            key = f"%{keyword}%"
            query = query.filter(or_(Employee.ma_nhan_vien.ilike(key), Employee.ho_ten.ilike(key)))
            
        records = query.all()

        for record in records:
            ot_hours = SalaryService.get_ot(db, record.ma_nhan_vien, record.thang, record.nam)
            
            # Tính lại tiền OT (theo lương hiện tại trong record)
            basic_hourly_wage = float(record.luong_co_ban) / 26 / 8
            tien_ot = ot_hours * basic_hourly_wage * record.he_so_luong
            
            # Gán vào object
            record.so_gio_tang_ca = ot_hours
            record.tien_tang_ca = round(tien_ot, 2)

        return records

    # Lấy phiếu lương chi tiết
    @staticmethod
    def get_salary_detail(db: Session, ma_nv: str, thang: int, nam: int):
        record = db.query(Salary).filter(
            Salary.ma_nhan_vien == ma_nv,
            Salary.thang == thang,
            Salary.nam == nam
        ).first()
    
        if record:
            ot_hours = SalaryService.get_ot(db, ma_nv, thang, nam)
            basic_hourly_wage = float(record.luong_co_ban) / 26 / 8
            tien_ot = ot_hours * basic_hourly_wage * record.he_so_luong
            
            record.so_gio_tang_ca = ot_hours
            record.tien_tang_ca = round(tien_ot, 2)
            
        return record

    # Xuất Excel
    @staticmethod
    def export_excel(db: Session, thang, nam, mapb, macn, macv, keyword):
        records = SalaryService.get_salaries(db, thang, nam, mapb, macn, macv, keyword)
        
        data_list = []
        for r in records:
            data_list.append({
                "Mã NV": r.ma_nhan_vien,
                "Họ Tên": r.ten_nhan_vien,
                "Chức Vụ": r.ten_chuc_vu,
                "Lương Cơ Bản": r.luong_co_ban,
                "Giờ Tăng Ca": getattr(r, 'so_gio_tang_ca', 0), # Lấy giá trị vừa gán
                "Tiền Tăng Ca": getattr(r, 'tien_tang_ca', 0),
                "Phụ Cấp": r.phu_cap,
                "Thưởng": r.thuong,
                "Phạt": r.phat,
                "Tổng Thực Nhận": r.tong_luong
            })
            
        df = pd.DataFrame(data_list)
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name=f"Luong_T{thang}_{nam}")
            worksheet = writer.sheets[f"Luong_T{thang}_{nam}"]
            for column_cells in worksheet.columns:
                length = max(len(str(cell.value)) for cell in column_cells)
                worksheet.column_dimensions[column_cells[0].column_letter].width = min(length + 2, 50)
            
        output.seek(0)
        return output