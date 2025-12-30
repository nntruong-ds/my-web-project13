from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from app.models.kpi import TrangThaiKPI

# Schema Base
class KPIBase(BaseModel):
    ten_kpi: str
    ky_danh_gia: str
    muc_tieu: float
    thuc_te: float
    don_vi_tinh: str
    ghi_chu: Optional[str] = None
    thang: int
    nam: int

# Schema tạo mới
class KPICreate(KPIBase):
    ma_nhan_vien: str

# Schema cập nhật
class KPIUpdate(BaseModel):
    # Cho phép sửa mục tiêu, thực tế, ghi chú...
    muc_tieu: Optional[float] = None
    thuc_te: Optional[float] = None
    don_vi_tinh: Optional[str] = None
    ghi_chu: Optional[str] = None
    trang_thai: Optional[TrangThaiKPI] = None

# Response màn hình 1
class KPIResponse(KPIBase):
    model_config = ConfigDict(from_attributes=True)
    
    ma_nhan_vien: str
    ten_nhan_vien: Optional[str] = None
    
    ty_le_hoan_thanh: Optional[float] = None # DB tự tính trả về
    trang_thai: TrangThaiKPI

# Response màn hình 2
class KPIOverviewResponse(BaseModel):
    ma_nhan_vien: str
    ten_nhan_vien: str
    ten_phong_ban: Optional[str] = None
    ten_chi_nhanh: Optional[str] = None
    kpi_trung_binh: float
    danh_gia_chung: str
    so_luong_tieu_chi: int