from pydantic import BaseModel, field_validator, model_validator
from datetime import date, time
from typing import Optional
from decimal import Decimal

from app.models.enums import TrangThaiChamCong

# Schema Base
class AttendanceBase(BaseModel):
    ma_nhan_vien: str
    ngay: date

    # Validator: Không được thao tác với ngày tương lai
    @field_validator('ngay')
    @classmethod
    def validate_ngay(cls, v: date):
        if v > date.today():
            raise ValueError(f"Không thể chấm công cho ngày tương lai ({v})!")
        return v

# Schema Check-in/Check-out (Dùng cho API Check-in/Check-out)
# Nhân viên KHÔNG ĐƯỢC gửi ngày giờ lên, Server tự quyết định
class CheckInRequest(BaseModel):
    ma_nhan_vien: str

class CheckOutRequest(BaseModel):
    ma_nhan_vien: str

# Schema Bổ sung công (Dành cho Admin/Import Excel)
# Dùng khi nhân viên quên chấm công, Admin nhập lại dữ liệu cũ
class AttendanceUpdate(AttendanceBase):
    gio_vao: Optional[time] = None
    gio_ra: Optional[time] = None
    # Cho phép nhập ngày quá khứ (nhờ Validator ở Base)

    so_gio_lam: Optional[Decimal] = None
    so_gio_tang_ca: Optional[float] = None
    so_lan_di_muon_ve_som: Optional[int] = None
    trang_thai: Optional[TrangThaiChamCong] = None

    @model_validator(mode='after')
    def check_logic_gio(self):
        # Logic: Giờ ra > Giờ vào
        if self.gio_vao and self.gio_ra:
            if self.gio_ra <= self.gio_vao:
                raise ValueError("Giờ về phải muộn hơn Giờ làm!")
        return self

# Schema Response
class AttendanceResponse(AttendanceBase):
    gio_vao: Optional[time] = None
    gio_ra: Optional[time] = None
    so_gio_lam: Optional[Decimal] = 0.0
    trang_thai: TrangThaiChamCong
    so_gio_tang_ca: Optional[float] = 0.0
    so_lan_di_muon_ve_som: int = 0
    
    # Kèm tên nhân viên để hiển thị UI
    ten_nhan_vien: Optional[str] = None

    class Config:
        from_attributes = True