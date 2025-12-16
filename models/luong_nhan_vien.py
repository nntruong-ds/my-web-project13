from sqlalchemy import Column, String, Float
from app.configs.database import Base

class LuongNhanVien(Base):
    __tablename__ = "luong_nhan_vien"

    ma_nhan_vien = Column(String(20), primary_key=True)
    luong_co_ban = Column(Float, nullable=False)
    phu_cap = Column(Float, default=0)
    phat_di_muon = Column(Float, default=50000)
    phat_ve_som = Column(Float, default=50000)
    ot_rate = Column(Float, default=30000)
    he_so_luong = Column(Float, default=1.0)
