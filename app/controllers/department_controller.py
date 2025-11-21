from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.services.department_service import DepartmentService
from app.schemas.department_schema import *

class DepartmentController:
    @staticmethod
    def get_all_departments(db: Session, macn: int = None):
        return DepartmentService.get_all_departments(db, macn)
    
    @staticmethod
    def get_department(db:Session, id: str):
        department = DepartmentService.get_department_by_id(db, id)

        if not department:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy phòng ban có mã {id}"
            )
        
        return department

    @staticmethod
    def create_department(db: Session, data: DepartmentCreate):
        try:
            return DepartmentService.create_department(db, data)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        
    @staticmethod
    def update_department(db: Session, id: str, data: DepartmentUpdate):
        department = DepartmentService.update_department(db, id, data)

        if department is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Phòng ban không tồn tại"
            )
        
        return department
    
    @staticmethod
    def delete_department(db: Session, id: str):
        result = DepartmentService.delete_department(db, id)

        if not result:
            raise HTTPException(status_code=404, detail="Phòng ban không tồn tại")

        return {"message": "Xóa phòng ban thành công"}