from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional
from app.models.enums import ThuongPhat

class RewardDisciplineBase(BaseModel):
    id: int
    ma_nhan_vien: str
    loai: ThuongPhat
    ngay: date
    so_tien: float

# Create
class RewardDisciplineCreate(RewardDisciplineBase):
    hinh_thuc: Optional[str] = None
    ly_do: Optional[str] = None

# Update
class RewardDisciplineUpdate(BaseModel):
    ma_nhan_vien: Optional[str] = None
    loai: Optional[ThuongPhat]
    ngay: Optional[date] = None
    hinh_thuc: Optional[str] = None
    ly_do: Optional[str] = None
    so_tien: Optional[float] = None

# Response
class RewardDisciplineResponse(RewardDisciplineBase):
    model_config = ConfigDict(from_attributes=True)

    hinh_thuc: Optional[str] = None
    ly_do: Optional[str] = None
    
    ten_nhan_vien: Optional[str] = None
    ten_phong_ban: Optional[str] = None
    ten_chi_nhanh: Optional[str] = None