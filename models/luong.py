from sqlalchemy import Column, Integer, Float, String
from app.configs.database import Base

class Luong(Base):
    __tablename__ = "luong"

    ma_luong = Column(Integer, primary_key=True, autoincrement=True)
    ma_nhan_vien = Column(String(20))
    thang = Column(Integer)
    nam = Column(Integer)
    luong_co_ban = Column(Float)
    phu_cap = Column(Float)
    thuong = Column(Float)
    khau_tru = Column(Float)
    tong_luong = Column(Float)
    ghi_chu = Column(String(255))
    he_so_luong = Column(Float)
