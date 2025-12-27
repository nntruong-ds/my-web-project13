from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional

from app.models.enums import TrangThaiBHYT

# Schema cơ bản
class HealthInsuranceBase(BaseModel):
    ma_nhan_vien: str
    so_the_bhyt: str
    thang_nam: date
    thang: int

# Create
class HealthInsuranceCreate(HealthInsuranceBase):
    trang_thai: Optional[TrangThaiBHYT] = TrangThaiBHYT.HOAT_DONG

# Update (Gửi body JSON)
class HealthInsuranceUpdate(HealthInsuranceBase):
    trang_thai: TrangThaiBHYT

# Response hiển thị (Tự động map @property)
class HealthInsuranceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ma_nhan_vien: str
    ten_nhan_vien: Optional[str] = None
    ten_phong_ban: Optional[str] = None
    ten_chi_nhanh: Optional[str] = None
    
    so_the_bhyt: str
    thang_nam: date
    thang: int
    trang_thai: TrangThaiBHYT