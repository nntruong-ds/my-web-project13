from pydantic import BaseModel
from datetime import datetime, date

class CheckInSchema(BaseModel):
    ma_nhan_vien: str

class CheckOutSchema(BaseModel):
    ma_nhan_vien: str

class ChamCongOut(BaseModel):
    ngay: date
    gio_vao: datetime | None
    gio_ra: datetime | None
    so_gio_lam: float
    trang_thai: str

    class Config:
        orm_mode = True
