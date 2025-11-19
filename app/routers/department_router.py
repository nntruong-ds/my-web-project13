from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.controllers.department_controller import DepartmentController
from app.schemas.department_schema import *
from app.configs.database import get_db

router = APIRouter(prefix="/departments", tags=["Departments"])

# Lấy danh sách phòng ban
@router.get("/", response_model=list[DepartmentResponse])
def get_all_departments(db: Session = Depends(get_db)):
    return DepartmentController.get_all_departments(db)

# Thêm phòng ban mới
@router.post("/", response_model=DepartmentResponse)
def create_department(data: DepartmentCreate, db: Session = Depends(get_db)):
    try:
        return DepartmentController.create_department(db, data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Cập nhật thông tin phòng ban
@router.put("/{mapb}", response_model=DepartmentResponse)
def update_department(mapb: str, data: DepartmentUpdate, db: Session = Depends(get_db)):
    return DepartmentController.update_department(db, mapb, data)
    
# Xóa phòng ban
@router.delete("/{mapb}", status_code=status.HTTP_200_OK)
def delete_department(mapb: str, db: Session = Depends(get_db)):
    return DepartmentController.delete_department(db, mapb)

#Xem thông tin phòng ban
@router.get("/{mapb}", response_model=DepartmentResponse)
def get_department_info(mapb: str, db: Session = Depends(get_db)):
    return DepartmentController.get_department_info(db, mapb)