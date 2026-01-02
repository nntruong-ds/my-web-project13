from pydantic import BaseModel, field_validator
from typing import Optional
from decimal import Decimal

# Schema cơ bản
class PositionBase(BaseModel):
    chucvu_id: str
    ten_chuc_vu: str
    luong_co_ban: Optional[Decimal] = Decimal(0)
    he_so_luong: Optional[int] = 1

    # Validator: Lương không được âm
    @field_validator('luong_co_ban')
    @classmethod
    def luong_khong_am(cls, v):
        if v is not None and v < 0:
            raise ValueError("Lương cơ bản không được âm")
        return v
    
    # Validator: Hệ số lương phải dương
    @field_validator('he_so_luong')
    @classmethod
    def he_so_duong(cls, v):
        if v is not None and v <= 0:
            raise ValueError("Hệ số lương phải lớn hơn 0")
        return v

class PositionCreate(PositionBase):
    pass

class PositionUpdate(BaseModel):
    ten_chuc_vu: Optional[str] = None
    luong_co_ban: Optional[Decimal] = None
    he_so_luong: Optional[int] = None

class PositionResponse(PositionBase):
    class Config:
        from_attributes = True