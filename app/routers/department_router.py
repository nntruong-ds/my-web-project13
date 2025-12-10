from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.controllers.department_controller import DepartmentController
from app.schemas.department_schema import *
from app.configs.database import get_db
from typing import Optional
from fastapi import Query

router = APIRouter(prefix="/departments", tags=["Departments"])

@router.get("/", response_model=list[DepartmentResponse])
def get_all_departments(macn: Optional[int] = Query(None, description="Nhập ID chi nhánh để lọc"), db: Session = Depends(get_db)):
    return DepartmentController.get_all_departments(db, macn)

@router.get("/{mapb}", response_model=DepartmentResponse)
def get_department_info(mapb: str, db: Session = Depends(get_db)):
    return DepartmentController.get_department(db, mapb)

@router.post("/", response_model=DepartmentResponse)
def create_department(data: DepartmentCreate, db: Session = Depends(get_db)):
    return DepartmentController.create_department(db, data)

@router.put("/{mapb}", response_model=DepartmentResponse)
def update_department(mapb: str, data: DepartmentUpdate, db: Session = Depends(get_db)):
    return DepartmentController.update_department(db, mapb, data)
    
@router.delete("/{mapb}", status_code=status.HTTP_200_OK)
def delete_department(mapb: str, db: Session = Depends(get_db)):
    return DepartmentController.delete_department(db, mapb)