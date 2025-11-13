from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.controllers.department_controller import DepartmentController
from app.schemas.department_schema import DepartmentCreate, DepartmentResponse
from app.configs.database import get_db

router = APIRouter(prefix="/departments", tags=["Departments"])

@router.post("/", response_model=DepartmentResponse)
def create_department(dept_data: DepartmentCreate, db: Session = Depends(get_db)):
    try:
        return DepartmentController.create_department(db, dept_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/", response_model=list[DepartmentResponse])
def get_all_departments(db: Session = Depends(get_db)):
    return DepartmentController.get_all_departments(db)