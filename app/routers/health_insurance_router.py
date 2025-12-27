from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.configs.database import get_db
from app.schemas.health_insurance_schema import *
from app.controllers.health_insurance_controller import HealthInsuranceController

router = APIRouter(prefix="/health-insurance", tags=["Health Insurance - Bảo hiểm Y tế"])

@router.get("/filter", response_model=List[HealthInsuranceResponse])
def get_list(
    keyword: Optional[str] = Query(None),
    thang: Optional[int] = Query(None),
    nam: Optional[int] = Query(None),
    mapb: Optional[str] = Query(None),
    macn: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    return HealthInsuranceController.search(db, keyword, thang, nam, mapb, macn)

@router.post("/", response_model=HealthInsuranceResponse)
def create(request: HealthInsuranceCreate, db: Session = Depends(get_db)):
    return HealthInsuranceController.create(db, request)

@router.put("/update", response_model=HealthInsuranceResponse)
def update(request: HealthInsuranceUpdate, db: Session = Depends(get_db)):
    return HealthInsuranceController.update(db, request)

@router.get("/export", response_class=StreamingResponse)
def export(
    keyword: Optional[str] = Query(None),
    thang: Optional[int] = Query(None),
    nam: Optional[int] = Query(None),
    mapb: Optional[str] = Query(None),
    macn: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    excel_file = HealthInsuranceController.export_excel(db, keyword, thang, nam, mapb, macn)
    
    if thang and nam:
        time_str = f"Thang{thang}_{nam}"
    elif nam:
        time_str = f"Nam_{nam}"
    else:
        time_str = datetime.now().strftime('%Y%m%d')
    filename = f"DS_BHXH_{time_str}.xlsx"
    
    return StreamingResponse(
        excel_file, 
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )