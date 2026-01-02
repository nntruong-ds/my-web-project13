from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.configs.database import get_db
from app.schemas.social_insurance_schema import *
from app.controllers.social_insurance_controller import SocialInsuranceController

router = APIRouter(prefix="/social-insurance", tags=["Social Insurance - Bảo hiểm xã hội"])

@router.get("/filter", response_model=List[SocialInsuranceResponse])
def get_insurance_list(
    keyword: Optional[str] = Query(None, description="Tìm tên, mã NV"),
    thang: Optional[int] = Query(None, description="Lọc theo tháng"),
    nam: Optional[int] = Query(None, description="Lọc theo năm"),
    mapb: Optional[str] = Query(None, description="Lọc theo ID phòng ban"),
    macn: Optional[int] = Query(None, description="Lọc theo ID chi nhánh"),
    db: Session = Depends(get_db)
):
    """
    API tìm kiếm BHXH nâng cao.
    Hỗ trợ lọc theo: Chi nhánh, Phòng ban, Tháng, Năm, Từ khóa.
    """
    return SocialInsuranceController.search(db, keyword, thang, nam, mapb, macn)

@router.post("/", response_model=SocialInsuranceResponse)
def create_insurance(request: SocialInsuranceCreate, db: Session = Depends(get_db)):
    return SocialInsuranceController.create(db, request)

@router.put("/update", response_model=SocialInsuranceResponse)
def update_insurance(
    request: SocialInsuranceUpdate,
    db: Session = Depends(get_db)
):
    return SocialInsuranceController.update(db, request)

@router.get("/export", response_class=StreamingResponse)
def export_insurance(
    keyword: Optional[str] = Query(None),
    thang: Optional[int] = Query(None),
    nam: Optional[int] = Query(None),
    mapb: Optional[str] = Query(None),
    macn: Optional[int] = Query(None),
    
    db: Session = Depends(get_db)
):
    """
    API Xuất Excel danh sách BHXH.
    Logic lọc giống hệt API /filter.
    """
    
    # Lấy file từ Service (dạng BytesIO)
    excel_file = SocialInsuranceController.export_excel(db, keyword, thang, nam, mapb, macn)
    
    # Tạo tên file động (Ví dụ: BHXH_Thang11_2025.xlsx)
    if thang and nam:
        time_str = f"Thang{thang}_{nam}"
    elif nam:
        time_str = f"Nam_{nam}"
    else:
        time_str = datetime.now().strftime('%Y%m%d')
    filename = f"DS_BHXH_{time_str}.xlsx"
    
    # Trả về stream download
    return StreamingResponse(
        excel_file, 
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )