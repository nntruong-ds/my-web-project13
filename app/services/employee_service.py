from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.employee import Employee
from app.models.department import Department
from app.models.branch import Branch
from app.services.department_service import DepartmentService
from app.services.branch_service import BranchService
from app.schemas.employee_schema import *

class EmployeeService:
    # Xem hồ sơ nhân viên
    @staticmethod
    def get_employee_by_id(db: Session, id: str):
        employee = EmployeeService.get_employee_orm(db, id)
        return EmployeeResponse.model_validate(employee)

    # Cập nhật hồ sơ nhân viên
    @staticmethod
    def update_profile_employee(db: Session, id: str, data: EmployeeUpdate):
        employee = EmployeeService.get_employee_orm(db, id)
        if not employee:
            return None
        
        # Check phòng ban có tồn tại không
        if data.phong_ban_id is not None:
            department = DepartmentService.get_department_orm(db, data.phong_ban_id)
            if not department:
                raise ValueError(f"Phòng ban '{data.phong_ban_id}' không tồn tại.")
            employee.phong_ban_id = data.phong_ban_id

        # Check chi nhánh có tồn tại không
        if data.chinhanh_id is not None:
            branch = BranchService.get_branch_orm(db, data.chinhanh_id)
            if not branch:
                raise ValueError(f"Chi nhánh '{data.chinhanh_id}' không tồn tại.")
            employee.chinhanh_id = data.chinhanh_id
            
        if data.ho_ten is not None:
            employee.ho_ten = data.ho_ten
        
        if data.email is not None:
            employee.email = data.email

        if data.chuc_vu_id is not None:
            employee.chuc_vu_id = data.chuc_vu_id
            
        if data.ngay_vao_lam is not None:
            employee.ngay_vao_lam = data.ngay_vao_lam
            
        if data.trang_thai is not None:
            employee.trang_thai = data.trang_thai

        db.commit()
        db.refresh(employee)
        
        return employee
    
    # Truy vấn nhân viên theo id
    @staticmethod
    def get_employee_orm(db:Session, id: str):
        return db.query(Employee).filter(Employee.ma_nhan_vien == id).first()
    
    # QUẢN LÝ NHÂN VIÊN

    # Lấy danh sách nhân viên
    @staticmethod
    def get_list_employees(
        db: Session, 
        macn: int = None,    # Lọc theo ID Chi nhánh
        mapb: str = None,    # Lọc theo ID Phòng ban
        chucvu: str = None,  # Lọc theo Mã Chức vụ
        keyword: str = None  # Ô tìm kiếm (Tên hoặc ID)
    ):
        # Khởi tạo query
        query = db.query(Employee)
        
        # Giúp hiển thị tên phòng ban, chi nhánh lên bảng danh sách
        query = query.options(
            joinedload(Employee.phong_truc_thuoc),
            joinedload(Employee.chi_nhanh_lam_viec)
        )

        # Áp dụng bộ lọc (Nếu user có chọn drop-down)
        if macn:
            query = query.filter(Employee.chinhanh_id == macn)
        
        if mapb:
            query = query.filter(Employee.phong_ban_id == mapb)
            
        if chucvu:
            query = query.filter(Employee.chuc_vu_id == chucvu)
            
        # Tìm kiếm từ khóa (Theo Tên HOẶC Mã NV)
        if keyword:
            search_pattern = f"%{keyword}%"
            query = query.filter(
                or_(
                    Employee.ho_ten.like(search_pattern),
                    Employee.ma_nhan_vien.like(search_pattern)
                )
            )
            
        return [EmployeeResponse.model_validate(e) for e in query.all()]
    
    # Tạo nhân viên mới
    @staticmethod
    def create_employee(db: Session, data: EmployeeCreate):
        # Check trùng mã NV
        if EmployeeService.get_employee_orm(db, data.ma_nhan_vien):
            raise ValueError(f"Nhân viên {data.ma_nhan_vien} đã tồn tại!")

        # Check trùng Email
        if db.query(Employee).filter(Employee.email == data.email).first():
            raise ValueError(f"Email {data.email} đã được sử dụng!")

        # Check Chi nhánh & Phòng ban tồn tại
        if not db.query(Branch).filter(Branch.ma_chi_nhanh == data.chinhanh_id).first():
            raise ValueError(f"Chi nhánh {data.chinhanh_id} không tồn tại!")

        if data.phong_ban_id:
            dept = db.query(Department).filter(Department.mapb == data.phong_ban_id).first()
            if not dept:
                raise ValueError(f"Phòng ban {data.phong_ban_id} không tồn tại!")
            # Logic: Phòng ban phải thuộc Chi nhánh
            if dept.ma_cn != data.chinhanh_id:
                raise ValueError(f"Phòng ban '{dept.mapb}' không thuộc chi nhánh này!")

        # Tạo mới
        new_emp = Employee(**data.model_dump())
        db.add(new_emp)
        db.commit()
        db.refresh(new_emp)
        return EmployeeResponse.model_validate(new_emp)
    
    # Xóa nhân viên
    @staticmethod
    def delete_employee(db: Session, manv: str):
        employee = EmployeeService.get_employee_orm(db, manv)
        if not employee:
            return False
        
        db.delete(employee)
        db.commit()
        return True