from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, datetime
from typing import Optional, List
from fastapi import Query
from fastapi.responses import StreamingResponse

from app.configs.database import get_db
from app.schemas.business_trip_schema import *
from app.controllers.business_trip_controller import BusinessTripController 
from app.utils.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/business-trips", tags=["Business Trips - Quản lý Đi công tác"])

# Cập nhật
@router.put("/{ma_nv}/{pb_id}/{cv_id}/{tu_ngay}", response_model=BusinessTripResponse)
def update_trip(
    ma_nv: str, pb_id: str, cv_id: str, tu_ngay: date,
    request: BusinessTripUpdate,
    db: Session = Depends(get_db),
):
    return BusinessTripController.update_trip(db, ma_nv, pb_id, cv_id, tu_ngay, request)

@router.get("/filter", response_model=List[BusinessTripDetailResponse])
def filter_trips(
    keyword: Optional[str] = Query(None, description="Tìm theo tên hoặc mã NV"),
    thang: Optional[int] = Query(None, description="Lọc theo tháng bắt đầu"),
    nam: Optional[int] = Query(None, description="Lọc theo năm bắt đầu"),
    phong_ban_id: Optional[str] = Query(None, description="ID phòng ban"),
    chi_nhanh: Optional[str] = Query(None, description="Tên chi nhánh"),
    
    db: Session = Depends(get_db),
):
    """
    API tìm kiếm công tác (giống màn hình quản lý nhân viên).
    URL ví dụ: /business-trips/filter?thang=11&nam=2025&keyword=Nguyen
    """
    return BusinessTripController.search_trips(
        db, keyword, thang, nam, phong_ban_id, chi_nhanh
    )

@router.get("/export", response_class=StreamingResponse)
def export_trips(
    keyword: Optional[str] = Query(None),
    thang: Optional[int] = Query(None),
    nam: Optional[int] = Query(None),
    phong_ban_id: Optional[str] = Query(None),
    chi_nhanh: Optional[str] = Query(None),
    
    db: Session = Depends(get_db),
):
    """
    API Xuất Excel danh sách công tác.
    Frontend gọi y hệt API filter, chỉ thay đường dẫn thành /export
    """
    
    # Lấy file từ Service (dạng BytesIO)
    excel_file = BusinessTripController.export_excel(
        db, keyword, thang, nam, phong_ban_id, chi_nhanh
    )
    
    # Đặt tên file động (Ví dụ: CongTac_11_2025.xlsx)
    filename = f"DS_CongTac_{thang if thang else 'All'}_{nam if nam else datetime.now().year}.xlsx"
    
    # Trả về stream download
    return StreamingResponse(
        excel_file, 
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# Xem lịch sử
@router.get("/{ma_nhan_vien}", response_model=List[BusinessTripDetailResponse])
def get_employee_trips(
    ma_nhan_vien: str,
    db: Session = Depends(get_db),
):
    return BusinessTripController.get_employee_trips(db, ma_nhan_vien)

# Đăng ký mới
@router.post("/", response_model=BusinessTripResponse)
def create_trip(
    request: BusinessTripCreate,
    db: Session = Depends(get_db),
):
    # Router chỉ việc chuyển request cho Controller
    return BusinessTripController.create_trip(db, request)