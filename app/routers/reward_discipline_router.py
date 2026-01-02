from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.responses import StreamingResponse
from datetime import datetime

from app.configs.database import get_db
from app.schemas.reward_discipline_schema import *
from app.controllers.reward_discipline_controller import RewardDisciplineController
from app.models.enums import ThuongPhat

router = APIRouter(prefix="/reward-discipline", tags=["Khen thưởng & Kỷ luật"])

# API Lấy danh sách (Search & Filter)
@router.get("/", response_model=List[RewardDisciplineResponse])
def get_list(
    # Các bộ lọc từ giao diện
    loai: Optional[ThuongPhat] = Query(None, description="Lọc: 'Khen thưởng' hoặc 'Kỷ luật'"),
    thang: Optional[int] = Query(None, description="Lọc theo tháng (bóc tách từ ngày)"),
    nam: Optional[int] = Query(None, description="Lọc theo năm (bóc tách từ ngày)"),
    mapb: Optional[str] = Query(None, description="Mã phòng ban"),
    macn: Optional[int] = Query(None, description="Mã chi nhánh"),
    keyword: Optional[str] = Query(None, description="Tìm theo Tên, Mã NV, Số QĐ..."),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách quyết định. Hỗ trợ tìm kiếm và lọc đa tiêu chí.
    """
    return RewardDisciplineController.search(db, keyword, thang, nam, loai, mapb, macn)

# API Tạo mới
@router.post("/", response_model=RewardDisciplineResponse)
def create(request: RewardDisciplineCreate, db: Session = Depends(get_db)):
    return RewardDisciplineController.create(db, request)

# API Cập nhật (Theo ID)
@router.put("/{id}", response_model=RewardDisciplineResponse)
def update(
    id: int, 
    request: RewardDisciplineUpdate, 
    db: Session = Depends(get_db)
):
    """
    Sửa quyết định theo ID. Chỉ cần gửi các trường thay đổi.
    """
    return RewardDisciplineController.update(db, id, request)

# API Xóa (Theo ID)
@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    return RewardDisciplineController.delete(db, id)

# API Xuất Excel
@router.get("/export", response_class=StreamingResponse)
def export_reward_discipline(
    loai: Optional[ThuongPhat] = Query(None),
    thang: Optional[int] = Query(None),
    nam: Optional[int] = Query(None),
    mapb: Optional[str] = Query(None),
    macn: Optional[int] = Query(None),
    keyword: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    # Lấy file stream từ Controller
    excel_file = RewardDisciplineController.export(db, keyword, thang, nam, loai, mapb, macn)
    
    # Đặt tên file tải về
    prefix = "DanhSach"
    if loai == ThuongPhat.KHEN_THUONG: prefix = "KhenThuong"
    elif loai == ThuongPhat.KY_LUAT: prefix = "KyLuat"
    
    # Nếu có lọc tháng năm thì gắn vào tên file cho dễ nhớ
    time_str = f"_{thang}_{nam}" if (thang and nam) else f"_{datetime.now().strftime('%Y%m%d')}"
    filename = f"{prefix}{time_str}.xlsx"
    
    return StreamingResponse(
        excel_file, 
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )