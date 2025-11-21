from sqlalchemy.orm import Session
from app.models.employee import Employee
from app.services.department_service import DepartmentService
from app.services.branch_service import BranchService
from app.schemas.employee_schema import *

class EmployeeService:
    # Xem hồ sơ nhân viên
    @staticmethod
    def get_profile_employee(db: Session, id: str) -> EmployeeResponse:
        employee = db.query(Employee).filter(Employee.ma_nhan_vien == id).first()
        return EmployeeResponse.model_validate(employee)

    # Cập nhật hồ sơ nhân viên
    @staticmethod
    def update_employee(db: Session, id: str, data: EmployeeUpdate):
        employee = EmployeeService.get_profile_employee(db, id)
        if not employee:
            return None
        
        if data.phong_ban_id is not None:
            department = DepartmentService.get_department_by_id(db, data.phong_ban_id)
            if not department:
                raise ValueError(f"Phòng ban '{data.phong_ban_id}' không tồn tại.")
            employee.phong_ban_id = data.phong_ban_id

        if data.chinhanh_id is not None:
            branch = BranchService.get_branch_by_id(db, data.chinhanh_id)
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