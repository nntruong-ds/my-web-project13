from sqlalchemy.orm import Session
from app.models.department import Department
from app.schemas.department_schema import *
from app.services.branch_service import BranchService
from sqlalchemy.orm import joinedload

class DepartmentService:
    # Lấy danh sách phòng ban
    @staticmethod
    def get_all_departments(db: Session, macn: int = None):
        query = db.query(Department)
        query = query.options(
            joinedload(Department.truong_phong), 
            joinedload(Department.ds_nhan_vien)
        )        

        if macn is not None:
            query = query.filter(Department.ma_cn == macn)
        
        departments = query.all()
        return [DepartmentResponse.model_validate(d) for d in departments]
    
    # Lấy thông tin phòng ban
    @staticmethod
    def get_department_by_id(db: Session, id: str):
        department = DepartmentService.get_department_orm(db, id)
        if not department:
            return None
        return DepartmentResponse.model_validate(department)

    # Thêm phòng ban mới
    @staticmethod
    def create_department(db: Session, data: DepartmentCreate):
        # Check chi nhánh tồn tại
        if not BranchService.get_branch_by_id(db, data.ma_cn):
            raise ValueError(f"Chi nhánh {data.ma_cn} không tồn tại!")

        # Check mã phòng ban trùng (nếu cần)
        department = DepartmentService.get_department_orm(db, data.mapb)
        if department:
            raise ValueError(f"Phòng {department.ten_phong} đã tồn tại!")

        department = Department(**data.model_dump())
    
        db.add(department)
        db.commit()
        db.refresh(department)
        return DepartmentResponse.model_validate(department)

    # Cập nhật thông tin phòng ban
    @staticmethod
    def update_department(db: Session, mapb: str, data: DepartmentUpdate):
        department = DepartmentService.get_department_orm(db, mapb)
        if not department:
            return None
        
        if data.ma_cn is not None:
            if not BranchService.get_branch_by_id(db, data.ma_cn):
                raise ValueError(f"Chi nhánh '{data.ma_cn}' không tồn tại.")
            department.ma_cn = data.ma_cn
        
        if data.ten_phong is not None:
            department.ten_phong = data.ten_phong

        if data.truong_phong_id is not None:
            department.truong_phong_id = data.truong_phong_id

        if data.ngay_tao is not None:
            department.ngay_tao = data.ngay_tao

        db.commit()
        db.refresh(department)
        return DepartmentResponse.model_validate(department)
    
    # Xóa phòng ban
    @staticmethod
    def delete_department(db: Session, mapb: str):
        department = DepartmentService.get_department_orm(db, mapb)
        if not department:
            return False
        
        db.delete(department)
        db.commit()
        return True

    # Truy vấn phòng ban theo mapb
    @staticmethod
    def get_department_orm(db: Session, id: str):
        return db.query(Department).filter(Department.mapb == id).first()