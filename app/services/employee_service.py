from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.models.employee import Employee
from app.models.department import Department
from app.models.branch import Branch
from app.services.department_service import DepartmentService
from app.services.branch_service import BranchService
from app.schemas.employee_schema import *

class EmployeeService:
    # Truy vấn nhân viên theo id
    @staticmethod
    def get_employee_orm(db:Session, id: str):
        return db.query(Employee).filter(Employee.ma_nhan_vien == id).first()
    
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
        if macn: query = query.filter(Employee.chinhanh_id == macn)
        
        if mapb: query = query.filter(Employee.phong_ban_id == mapb)
            
        if chucvu: query = query.filter(Employee.chuc_vu_id == chucvu)
            
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

    # Xem hồ sơ nhân viên
    @staticmethod
    def get_employee_by_id(db: Session, id: str):
        employee = EmployeeService.get_employee_orm(db, id)
        if not employee:
            return None
        return EmployeeResponse.model_validate(employee)

    # Tạo nhân viên mới
    @staticmethod
    def create_employee(db: Session, data: EmployeeCreate):
        # Check trùng mã NV
        if EmployeeService.get_employee_orm(db, data.ma_nhan_vien):
            raise ValueError(f"Nhân viên {data.ma_nhan_vien} đã tồn tại!")

        # Check trùng Email
        if db.query(Employee).filter(Employee.email == data.email).first():
            raise ValueError(f"Email {data.email} đã tồn tại. Vui lòng nhập email khác!")

        # Check Chi nhánh & Phòng ban
        # Check Chi nhánh có tồn tại không
        if not db.query(Branch).filter(Branch.ma_chi_nhanh == data.chinhanh_id).first():
            raise ValueError(f"Chi nhánh {data.chinhanh_id} không tồn tại!")

        # Check phòng ban có tồn tại không
        if data.phong_ban_id:
            department = db.query(Department).filter(Department.mapb == data.phong_ban_id).first()
            if not department:
                raise ValueError(f"Phòng ban {data.phong_ban_id} không tồn tại!")
            # Logic: Phòng ban phải thuộc Chi nhánh
            if department.ma_cn != data.chinhanh_id:
                raise ValueError(f"Phòng ban '{department.mapb}' không thuộc chi nhánh này!")

        # Tạo mới
        new_employee = Employee(**data.model_dump())
        db.add(new_employee)
        db.commit()
        db.refresh(new_employee)
        return EmployeeResponse.model_validate(new_employee)

    # Cập nhật hồ sơ nhân viên
    @staticmethod
    def update_profile_employee(db: Session, id: str, data: EmployeeUpdate):
        employee = EmployeeService.get_employee_orm(db, id)
        # Check nhân viên có tồn tại không
        if not employee:
            return None
        
        # Lấy dict các trường có gửi lên (loại bỏ các trường None)
        # exclude_unset=True: Chỉ lấy những gì user gửi
        update_data = data.model_dump(exclude_unset=True)

        # Xác định chi nhánh, phòng ban
        # Nếu user gửi ID mới thì dùng cái mới, không thì dùng cái cũ đang có trong DB
        branch_id = update_data.get("chinhanh_id", employee.chinhanh_id)
        department_id = update_data.get("phong_ban_id", employee.phong_ban_id)

        # Check chi nhánh có tồn tại không
        if "chinhanh_id" in update_data and update_data["chinhanh_id"] is not None:
             if not BranchService.get_branch_by_id(db, branch_id):
                raise ValueError(f"Chi nhánh '{branch_id}' không tồn tại.")

        # Check phòng ban có tồn tại không
        if "phong_ban_id" in update_data or "chinhanh_id" in update_data:
            
            # Chỉ cần check nếu nhân viên sẽ thuộc về một phòng ban nào đó (không phải None)
            if department_id is not None:
                # Tìm thông tin phòng ban đích
                department = DepartmentService.get_department_orm(db, department_id)
                
                # Check phòng ban tồn tại
                if not department:
                    raise ValueError(f"Phòng ban '{department_id}' không tồn tại.")
                
                # Check phòng ban có thuộc chi nhánh đích không?
                if department.ma_cn != branch_id:
                    # Lấy thêm tên chi nhánh để báo lỗi cho rõ (Optional)
                    branch = BranchService.get_branch_by_id(db, branch_id)
                    branch_name = branch.ten_chi_nhanh if branch else branch_id
                    
                    raise ValueError(
                        f"Mâu thuẫn: Phòng ban '{department.ten_phong}' thuộc chi nhánh {department.ma_cn}, "
                        f"không thể gán cho nhân viên thuộc chi nhánh '{branch_name}'."
                    )
            
        
        # Check email đã tồn tại chưa
        if "email" in update_data and update_data["email"] is not None:
            new_email = update_data["email"]
            if new_email != employee.email: # Chỉ check nếu email khác email cũ
                if db.query(Employee).filter(Employee.email == new_email).first():
                    raise ValueError(f"Email {new_email} đã có người sử dụng!")

        # Cập nhật tự động
        for key, value in update_data.items():
            setattr(employee, key, value)

        db.commit()
        db.refresh(employee)
        
        return employee
    
    # Xóa nhân viên
    @staticmethod
    def delete_employee(db: Session, manv: str):
        employee = EmployeeService.get_employee_orm(db, manv)
        if not employee:
            return False
        
        db.delete(employee)
        db.commit()
        return True