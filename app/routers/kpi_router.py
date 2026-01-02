from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.responses import StreamingResponse
from datetime import datetime

from app.configs.database import get_db
from app.schemas.kpi_schema import *
from app.controllers.kpi_controller import KPIController

router = APIRouter(prefix="/kpi", tags=["KPI - Quản lý hiệu suất"])

# API tổng quan cho màn hình 1
@router.get("/overview", response_model=List[KPIOverviewResponse])
def get_kpi_overview(
    thang: int = Query(..., description="Tháng là bắt buộc"),
    nam: int = Query(..., description="Năm là bắt buộc"),
    mapb: Optional[str] = Query(None),
    macn: Optional[int] = Query(None),
    keyword: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Trả về danh sách nhân viên kèm điểm KPI trung bình.
    """
    return KPIController.get_overview(db, thang, nam, mapb, macn, keyword)

@router.get("/export-overview", response_class=StreamingResponse)
def export_kpi_overview(
    thang: int = Query(..., description="Tháng"),
    nam: int = Query(..., description="Năm"),
    mapb: Optional[str] = Query(None),
    macn: Optional[int] = Query(None),
    keyword: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Xuất Excel báo cáo tổng hợp KPI (Có điểm trung bình và xếp loại).
    """
    # Lấy file từ Service
    excel_file = KPIController.export_overview(db, thang, nam, mapb, macn, keyword)
    
    # Tạo tên file
    filename = f"BaoCao_KPI_Thang{thang}_{nam}.xlsx"
    
    # Trả về
    return StreamingResponse(
        excel_file, 
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# API chi tiết cho màn hình 2
@router.get("/detail/{ma_nhan_vien}", response_model=List[KPIResponse])
def get_kpi_detail(
    ma_nhan_vien: str,
    thang: int = Query(...),
    nam: int = Query(...),
    db: Session = Depends(get_db)
):
    """
    Trả về chi tiết từng đầu mục KPI của 1 nhân viên.
    """
    return KPIController.get_details(db, ma_nhan_vien, thang, nam)

# Tạo mới KPI
@router.post("/", response_model=KPIResponse)
def create_kpi(request: KPICreate, db: Session = Depends(get_db)):
    return KPIController.create(db, request)

# Cập nhật kết quả KPI
@router.put("/update", response_model=KPIResponse)
def update_kpi(
    request: KPIUpdate,
    ma_nhan_vien: str = Query(...),
    ten_kpi: str = Query(...),
    ky_danh_gia: str = Query(...),
    db: Session = Depends(get_db)
):
    return KPIController.update(db, ma_nhan_vien, ten_kpi, ky_danh_gia, request)