from sqlalchemy.orm import Session
from app.models.department import Department
from app.schemas.department_schema import *

class DepartmentService:
    # Lấy danh sách phòng ban
    @staticmethod
    def get_all_departments(db: Session):
        departments = db.query(Department).all()
        return [DepartmentResponse.model_validate(d) for d in departments]
    
    # Thêm phòng ban mới
    @staticmethod
    def create_department(db: Session, data: DepartmentCreate):
        department = Department(mapb = data.mapb, 
                                ten_phong = data.ten_phong,
                                truong_phong_id = data.truong_phong_id,
                                ma_cn = data.ma_cn)
    
        db.add(department)
        db.commit()
        db.refresh(department)
        return DepartmentResponse.model_validate(department)

    # Cập nhật thông tin phòng ban
    @staticmethod
    def update_department(db: Session, mapb: str, data: DepartmentUpdate):
        department = DepartmentService.get_department_by_mapb(db, mapb)
        if not department:
            return None
        
        # Cập nhật từng thông tin được gửi lên
        if data.ten_phong is not None:
            department.ten_phong = data.ten_phong

        if data.truong_phong_id is not None:
            department.truong_phong_id = data.truong_phong_id

        if data.ngay_tao is not None:
            department.ngay_tao = data.ngay_tao

        if data.ma_cn is not None:
            department.ma_cn = data.ma_cn

        db.commit()
        db.refresh(department)
        return department
    
    # Xóa phòng ban
    @staticmethod
    def delete_department(db: Session, mapb: str):
        department = DepartmentService.get_department_by_mapb(db, mapb)
        if not department:
            return None
        
        db.delete(department)
        db.commit()
        return True

    # Lấy thông tin phòng ban
    @staticmethod
    def get_department_by_mapb(db: Session, mapb: str):
        department = db.query(Department).filter(Department.mapb == mapb).first()
        
        if not department:
            return None

        return DepartmentResponse.model_validate(department)