from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.services.department_service import DepartmentService
from app.schemas.department_schema import *

class DepartmentController:
    # Lấy danh sách phòng ban
    @staticmethod
    def get_all_departments(db: Session):
        return DepartmentService.get_all_departments(db)

    # Thêm phòng ban mới
    @staticmethod
    def create_department(db: Session, data: DepartmentCreate) -> DepartmentResponse:
        try:
            return DepartmentService.create_department(db, data)
        except ValueError as e:
            raise Exception(str(e))
        
    # Cập nhật thông tin phòng ban
    @staticmethod
    def update_department(db: Session, id: str, data: DepartmentUpdate):
        department = DepartmentService.update_department(db, id, data)

        if department is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found"
            )
        
        return department
    
    # Xóa phòng ban
    @staticmethod
    def delete_department(db: Session, id: str):
        result = DepartmentService.delete_department(db, id)

        if result is None:
            raise HTTPException(status_code=404, detail="Department not found")

        return {"message": "Department deleted successfully"}
    
    # Xem thông tin phòng ban
    @staticmethod
    def get_department_info(db:Session, id: str):
        department = DepartmentService.get_department_info(db, id)
        
        if not department:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy phòng ban có mã {id}"
            )
        
        return department