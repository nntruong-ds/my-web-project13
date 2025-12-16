from sqlalchemy import Column, Integer, Date, DateTime, Float, String, Text
from app.configs.database import Base

class ChamCong(Base):
    __tablename__ = "cham_cong"

    ma_nhan_vien = Column(String(20), primary_key=True)
    ngay = Column(Date, primary_key=True)
    gio_vao = Column(DateTime, nullable=True)
    gio_ra = Column(DateTime, nullable=True)
    so_gio_lam = Column(Float, default=0)
    trang_thai = Column(String(20), default="DI_LAM")
    ghi_chu = Column(Text, nullable=True)
