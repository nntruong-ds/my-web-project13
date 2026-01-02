from pydantic import BaseModel, ConfigDict
from typing import Optional

class SalaryBase(BaseModel):
    thang: int
    nam: int
    luong_co_ban: float
    phu_cap: float = 0
    thuong: float = 0
    luong_no_thang_truoc: float = 0
    he_so_luong: int = 1
    bhyt: float = 0
    bhxh: float = 0
    phat: float = 0

# Schema Request gửi lên để tính toán
class SalaryRequest(SalaryBase):
    ma_nhan_vien: str

# Schema Response trả về để hiển thị
class SalaryResponse(SalaryBase):
    model_config = ConfigDict(from_attributes=True)
    
    ma_nhan_vien: str
    tong_luong: float

    # Các trường hiển thị thêm
    so_gio_tang_ca: Optional[float] = 0
    tien_tang_ca: Optional[float] = 0
    
    ten_nhan_vien: Optional[str] = None
    ten_chuc_vu: Optional[str] = None
    ten_phong_ban: Optional[str] = None