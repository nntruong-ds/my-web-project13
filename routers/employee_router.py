from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.configs.database import get_db
from app.schemas.employee_schema import EmployeeProfile, EmployeeUpdate
from app.services import employee_service

router = APIRouter(prefix="/employee", tags=["Employee"])

@router.get("/profile", response_model=EmployeeProfile)
def view_profile(username: str, db: Session = Depends(get_db)):
    return employee_service.get_profile(db, username)


@router.put("/profile", response_model=EmployeeProfile)
def edit_profile(username: str, updates: EmployeeUpdate, db: Session = Depends(get_db)):
    clean = {k: v for k, v in updates.dict().items() if v is not None}
    return employee_service.update_profile(db, username, clean)
