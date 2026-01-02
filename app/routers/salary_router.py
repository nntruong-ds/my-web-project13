from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional

from app.configs.database import get_db
from app.schemas.salary_schema import SalaryRequest, SalaryResponse
from app.controllers.salary_controller import SalaryController

router = APIRouter(prefix="/salary", tags=["Payroll - Quản lý lương"])

@router.get("/list", response_model=List[SalaryResponse])
def get_salaries(
    thang: int = Query(...),
    nam: int = Query(...),
    mapb: Optional[str] = Query(None),
    macn: Optional[int] = Query(None),
    macv: Optional[str] = Query(None),
    keyword: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return SalaryController.get_list(db, thang, nam, mapb, macn, macv, keyword)

@router.get("/detail/{ma_nhan_vien}", response_model=SalaryResponse)
def get_salary_detail(
    ma_nhan_vien: str,
    thang: int = Query(...),
    nam: int = Query(...),
    db: Session = Depends(get_db)
):
    return SalaryController.get_detail(db, ma_nhan_vien, thang, nam)

@router.post("/calculate", response_model=SalaryResponse)
def calculate_salary(
    data: SalaryRequest,
    db: Session = Depends(get_db)
):
    """
    Tính toán và Lưu lương.
    Tự động lấy giờ làm thêm từ module Chấm công để tính tiền tăng ca.
    """
    return SalaryController.calculate(db, data)

@router.get("/export", response_class=StreamingResponse)
def export_salary(
    thang: int = Query(...),
    nam: int = Query(...),
    mapb: Optional[str] = Query(None),
    macn: Optional[int] = Query(None),
    macv: Optional[str] = Query(None),
    keyword: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    excel_file = SalaryController.export(db, thang, nam, mapb, macn, macv, keyword)
    filename = f"BangLuong_T{thang}_{nam}.xlsx"
    
    return StreamingResponse(
        excel_file, 
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )